const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//CREATE NEW List
router.post("/", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(200).json(savedList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you are not allowed!");
  }
});

//  //DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    console.log("deleting list with id:", req.params.id);
    try {
      await List.findByIdAndDelete(req?.params?.id);
      res.status(200).json("List has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cannot delete any movie");
  }
});

//  //GET RANDOM MOVIE OR SERIES BASED ON TYPE OR GENRE OR BOTH
router.get("/", async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 5 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 5 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 5 } }]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
