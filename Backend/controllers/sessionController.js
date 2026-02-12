const Session = require("../models/Session");
const Question = require("../models/Question");
const { Sessions } = require("openai/resources/beta/realtime/sessions.js");

//@desc    Create a new session and linked questions
//@route   POST  /api/sessions/create
//@access  Private
exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions:{questions} } =
      req.body;
    const userId = req.user._id; //Assuming you have a middleware setting req.user

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      }),
    );
    session.questions = questionDocs;
    await session.save();

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
//@desc    Get All sessions for the logged-in user
//@route   GET  /api/sessions/my-sessions
//@access  Private
exports.getMySessions = async (req, res) => {
  
  try {
     const sessions = await Session.find({ user:req.user._id})
    .sort({ createdAt: -1 })
    .populate("questions");

    // if(!sessions){
    //   return res.status(200).send({sessions:[],message:"No session found"})
    // }
    
    return res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//@desc    Get a session by ID with populated questions
//@route   GET  /api/sessions/:id
//@access  Private
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createAt: 1 } },
      })
      .exec();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not Found",
      });
    }
    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//@desc     Delete a session and its questions
//@route   DELETE  /api/sessions/:id
//@access  Private
exports.deleteSession = async (req, res) => {
  try {
    console.log(req.params.id)
      
      const session = await Session.findById(req.params.id)

      if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not Found",
      });
    }

    //check if the logged-in user owns this session
    if(session.user.toString() !== req.user.id){
        return res.status(401).json({
            message: "Not Authorized to Delete this Session"
        });
    }

    // First, Delete all Questions linked to tis session
    await Question.deleteMany({session: session._id});

    //Then, Delete The Session
    await Session.deleteOne({_id:req.params.id});

    res.status(200).json({message: "session deleted successfully",success:true})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
