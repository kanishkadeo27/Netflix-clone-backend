const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");


//CREATE NEW List
router.post('/', verify, async (req, res) => {
    if (req?.user?.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(200).json(savedList);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else {
        res.status(403).json("you are not allowed!")
    }
})


//  //DELETE
router.delete('/:id', verify, async (req, res) => {
    if (req?.user?.isAdmin) {
        try {
            await List.findByIdAndDelete(req?.params?.id);
            res.status(200).json("List has been deleted...");
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("you cannot delete any movie")
    }
})


//  //GET
router.get('/random', async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                                { $match: { type: typeQuery, genre: genreQuery } },
                            ]);
                        }
                        else {
                            
                            list = await List.aggregate([
                                { $sample: { size: 10 } },
                                { $match: { type: typeQuery } },
                                
                            ]);
                        }
                    }
        else {
            list = await List.aggregate([
                { $sample: { size: 10 } },
            ]);
        }
        res.status(200).json(list);
        
    } catch (error) {
        res.status(500).json(error)
    }
}
)

//  //GET1
// router.get('/find/:id', async (req, res) => {
    //     try {
        //         const movie = await Movie.findById(req?.params?.id);
        //         res.status(200).json(movie);
        
        //     } catch (error) {
            //         res.status(500).json(error)
            //     }
            // }
            // )
// //UPDATE EXISTING MOVIE
// router.put('/:id', verify, async (req, res) => {
//     if (req?.user?.isAdmin) {
//         const updatedMovie = await Movie.findByIdAndUpdate(req?.params?.id, { $set: req.body }
//             , {
//                 new: true
//             }
//         );
//         try {
//             res.status(200).json(updatedMovie);
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     }
//     else {
//         res.status(403).json("you are not allowed to add movie")
//     }
// })
// //GET ALL MOVIES
// router.get('/', verify, async (req, res) => {
//     if (req?.user?.isAdmin) {
//         try {
//             const movies = await Movie.find();
//             res.status(200).json(movies.reverse());
//         } catch (error) {
//             res.status(500).json(error)
//         }
//     }
//     else {
//         res.status(403).json("you are not allowed to see all users")
//     }
// })


module.exports = router;