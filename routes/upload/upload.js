// Import necessary libraries and modules.
const express = require('express');
const router = express.Router();
const {exec} = require('child_process');// Used for executing external processes.

const UploadRecord = require('../../models/upload_records'); // Import the UploadRecord model.
const UserRegistration = require('../../models/user_registration_model'); // Import the UserRegistration model.
const verifyToken = require('../../middlewares/auth'); // Import a custom authentication middleware.
const FCM = require('../../middlewares/notification'); // Import a custom Firebase Cloud Messaging (FCM) module.

const admin = require('firebase-admin'); // Import the Firebase Admin SDK.
const serviceAccount = require('../../middlewares/serviceAccount.json'); // Service account credentials for Firebase Admin SDK.
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) // Initialize Firebase Admin SDK.
});


const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const {log} = require('console');

// Set up multer to handle file uploads.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // Set the destination to an absolute path to the /public/uploads directory
        const destinationPath = path.resolve(__dirname, '../../public/uploads/');
        cb(null, destinationPath);
    },
    filename: function(req, file, cb) {
        const randomName = uuidv4().slice(0, 10); // Generate random name with 10 characters
        const fileExtension = path.extname(file.originalname);
        const newFileName = randomName + fileExtension;
        cb(null, newFileName);
    },
});


const upload = multer({
    storage: storage
});

const max_image_upload_count = 10;

// Define a POST route for uploading records, using the 'verifyToken' middleware for authentication.
router.post('/', verifyToken, upload.array('images', max_image_upload_count), async(req, res) => {
    try {
        const uploadedFiles = req.files;
        const userId = req.userId;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({
                message: 'No files were uploaded.',
                error: 'no_images'
            });
        }

        const imageSet = uploadedFiles.map((file) => file.filename);

        // Create a new 'UploadRecord' with the provided data.
        const newUploadRecord = new UploadRecord({
            user_id: userId,
            symptom_type: req.body.symptom_type,
            category: req.body.category,
            affected_radius: req.body.affected_area,
            location: {
                type: 'Point',
                coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
            },
            recent_treatments: req.body.recent_treatments,
            image_urls: imageSet,
            status: 'Pending'
        });

        const savedRecord = await newUploadRecord.save();

        // Execute a Python script based on the category.
        if (req.body.category == 'insect') {
            exec(`python ./scripts/insects_model.py ${imageSet} ${savedRecord._id}`, (error, stdout, stderr) => {


                if (error) {
                    console.log(`Python Execution Error ${error}`);
                }

                if (stderr) {
                    console.log(`Python Processing Error ${stderr}`);
                }
            });
        } else if (req.body.category == 'leaves') {
            exec(`python ./scripts/leaves_model.py ${imageSet} ${savedRecord._id}`, (error, stdout, stderr) => {


                if (error) {
                    console.log(`Python Execution Error ${error}`);
                }

                if (stderr) {
                    console.log(`Python Processing Error ${stderr}`);
                }
            });
        } else if (req.body.category == 'fruit') {
            exec(`python ./scripts/fruits_model.py ${imageSet} ${savedRecord._id}`, (error, stdout, stderr) => {


                if (error) {
                    console.log(`Python Execution Error ${error}`);
                }

                if (stderr) {
                    console.log(`Python Processing Error ${stderr}`);
                }
            });
        }

        res.status(201).json({
            message: 'Upload record created successfully.',
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: message,
            error: 'unknown_error'
        });
    }
});

// Define a POST route for retrieving user's upload records, using the 'verifyToken' middleware for authentication.
router.post('/get', verifyToken, upload.none(), async(req, res) => {
    try {
        const userId = req.userId;
        const results = await UploadRecord.find({
            user_id: userId
        });
        res.status(201).json({
            error: null,
            message: 'Daat Retrive Success!',
            results: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: message,
            error: 'unknown_error'
        });
    }
});

// Define a POST route for marking an upload record as complete.
router.post('/complete', upload.none(), async(req, res) => {
    try {


        const {
            case_id,
            output_urls,
            output_lables
        } = req.body;


        const selectedRecord = await UploadRecord.findById(case_id);


        if (!selectedRecord) {
            res.status(404).json({
                message: 'No Upload Record!',
                error: 'no_upload_record'
            });
        }

        selectedRecord.status = 'Completed';
        selectedRecord.output_urls = output_urls;
        selectedRecord.output_lables = output_lables;

        await selectedRecord.save();

        const owner = await UserRegistration.findById(selectedRecord.user_id);
        let detecction_status;

        if (object_dict.length > 0) {
            detecction_status = "Some objects were detected! click here for more info"
        } else {
            detecction_status = "No significant objects were found."
        }

        const fcm = new FCM();
        fcm.sendMessage("Analysis Completed", detecction_status, owner.fcm_token, admin);

        res.status(201).json({
            message: 'Upload record created successfully.',
            error: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error,
            error: 'unknown_error'
        });
    }
});

module.exports = router;