const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//CREATE NEW MOVIE
router.post("/", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(200).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you are not allowed to add movie");
  }
});

//UPDATE EXISTING MOVIE
router.put("/:id", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    try {
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you are not allowed to add movie");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req?.params?.id);
      res.status(200).json("Movie has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cannot delete any movie");
  }
});

//GET one movie
router.get("/find/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req?.params?.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET RANDOM MOVIE or SERIES FOR FEATURED MOVIE OR SERIES
router.get("/random", async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL MOVIES
router.get("/", verify, async (req, res) => {
  if (req?.user?.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you are not allowed to see all users");
  }
});

module.exports = router;
