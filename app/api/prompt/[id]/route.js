import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt not found", { status: 404 });
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (err) {
    return new Response("failed to fetch prompt", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();
    const updatedPrompt = await Prompt.findById(params.id);
    if (!updatedPrompt)
      return new Response("Prompt not found", { status: 404 });
    updatedPrompt.prompt = prompt;
    updatedPrompt.tag = tag;
    await updatedPrompt.save();

    return new Response(JSON.stringify(updatedPrompt), { status: 200 });
  } catch (err) {
    return new Response("failed to update prompt", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndDelete(params.id);
    return new Response("Prompt Deleted successfully", { status: 200 });
  } catch (err) {
    return new Response("failed to delete prompt", { status: 500 });
  }
};
