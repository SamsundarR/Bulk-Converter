import mammoth from 'mammoth';

export const wordToHtmlLogic = async (file) => {
  try {
    // Ensure the file is in the correct format (e.g., .docx)

    // Convert the Word document to HTML using mammoth
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value; // This is the HTML string
  } catch (error) {
    console.error('Error during conversion:', error);
    throw error;
  }
};
