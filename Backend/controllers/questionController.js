const Question = require("../models/Question");
const Session = require("../models/Session");
const {generateInterviewQuestions} = require('./aiController')

//@desc    Add additional questions to an existing session
//@route   POST  /api/questions/add
//@access  Private
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session Not Found",
      });
    }

    
    req.body = {
      role:session.role,
      experience:session.experience, 
      topicsToFocus:session.topicsToFocus, 
      numberOfQuestions:10
    }
  
    await generateInterviewQuestions(req,res,()=>{});
    const data = req.questions

    //create new questions
    const createdQuestions = await Question.insertMany(
      data.questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
        isPinned: false,
        note:null
      })),
      {new:true}
    );

    
    //Update session to include new question IDs
    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();
    
    res.status(201).send({success:true,createdQuestions:createdQuestions});
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

//@desc    Pin or UnPin a question
//@route   POST  /api/questions/:id/pin
//@access  Private
exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question Not Found",
      });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

//@desc    Update a note for a question
//@route   POST  /api/questions/:id/note
//@access  Private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not Found",
      });
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
