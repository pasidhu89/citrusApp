import express from 'express';
import Treatment from '../models/treatmentModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const treatmentRouter = express.Router();

// Get all treatments
treatmentRouter.get('/', expressAsyncHandler(async (req, res) => {
  const treatments = await Treatment.find();
  res.send(treatments);
}));


treatmentRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      // Check if the user is authorized to create a treatment
      if (!isAdmin) {
        return res.status(403).send({ message: 'Permission Denied' });
      }

      // Log the request body to see if the data is being sent correctly
      console.log('Request Body:', req.body);

      const newTreatment = new Treatment({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        duration: req.body.duration,
       
      });

      const treatment = await newTreatment.save();
      return res.status(201).send({ message: 'Treatment Created', treatment });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  })
);



// Update an existing treatment
treatmentRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const treatmentId = req.params.id;
    const treatment = await Treatment.findById(treatmentId);
    if (treatment) {
      treatment.name = req.body.name;
      treatment.type = req.body.type;
      treatment.description = req.body.description;
      treatment.duration = req.body.duration;
    

      const updatedTreatment = await treatment.save();
      res.send({ message: 'Treatment Updated', treatment: updatedTreatment });
    } else {
      res.status(404).send({ message: 'Treatment Not Found' });
    }
  })
);

// Delete a treatment
treatmentRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const treatment = await Treatment.findById(req.params.id);
    if (treatment) {
      await treatment.remove();
      res.send({ message: 'Treatment Deleted' });
    } else {
      res.status(404).send({ message: 'Treatment Not Found' });
    }
  })
);

// Retrieve a treatment by ID
treatmentRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.params.id);
  if (treatment) {
    res.send(treatment);
  } else {
    res.status(404).send({ message: 'Treatment Not Found' });
  }
}));



export default treatmentRouter;
