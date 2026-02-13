import express from 'express';
import { addListing, list, deleteListing, singleListing, editListing, userListings } from '../controller/listingController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const listingRouter = express.Router();

listingRouter.post('/add', userAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addListing);
listingRouter.put("/:editId/edit", userAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 },]), editListing);
listingRouter.delete('/:deleteId', userAuth, deleteListing);
listingRouter.get('/list', list);
listingRouter.get('/user/me', userAuth, userListings);
listingRouter.get('/:id', userAuth, singleListing);

export default listingRouter;