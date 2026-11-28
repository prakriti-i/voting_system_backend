import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";


export async function createCandidate(req, res) {
    try {
        const { name, party, age } = req.body;

        if (!name || !party || !age) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newCandidate = await Candidate.create({
            name,
            party,
            age
        });

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            data: newCandidate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function getAllCandidates(req, res) {
    try {
        const candidates = await Candidate.find().select("-votes");

        return res.status(200).json({
            success: true,
            data: candidates
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function getCandidateById(req, res) {
    try {
        const { id } = req.params;
        const candidate = await Candidate.findById(id).select("-votes");

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate fetched successfully",
            data: candidate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function updateCandidate(req, res) {
    try {
        const { id } = req.params;
        const { name, party, age } = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            { name, party, age },
            { new: true, runValidators: true }
        );

        if (!updatedCandidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully",
            data: updatedCandidate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function deleteCandidate(req, res) {
    try {
        const { id } = req.params;

        const deletedCandidate = await Candidate.findByIdAndDelete(id);

        if (!deletedCandidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function voteForCandidate(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        await User.findByIdAndUpdate(userId, { isVoted: true });

        return res.status(200).json({
            success: true,
            message: "Vote recorded successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function getVoteCounts(req, res) {
    try {
        const results = await Candidate.find()
            .sort({ voteCount: -1 })
            .select("name party voteCount");

        return res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}