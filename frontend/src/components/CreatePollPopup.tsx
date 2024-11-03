import {
    useState
} from 'react';

export default function CreatePollPopup() {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [questions, setQuestions] = useState<string[]>(['']);

    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = value;
        setQuestions(updatedQuestions);
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: title,
            questions: questions,
            votes: []
        };

        try {
            console.log(payload);
            const response = await fetch('http://localhost:3000/api/polls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("Poll created successfully");
                setTitle('');
                setQuestions(['']);
                window.location.reload();
            } else {
                console.error("Failed to create poll");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsPopupOpen(!isPopupOpen)}
            >
                Create Poll
            </button>
            {isPopupOpen && (
                <div className="absolute top-0 left-0 w-full h-full flex content-center justify-center min-h-screen min-w-screen flex-wrap z-20">
                <div
                    className="bg-[#0000008a] absolute top-0 left-0 w-full h-full"
                    onClick={() => setIsPopupOpen(false)}
                >
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="h-fit bg-white p-10 rounded-md shadow-2xl border-2 border-black z-30"
                >
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Poll Title"
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <div className="flex flex-col w-96">
                        {questions.map((question, index) => (
                            <div key={index} className="flex items-center mb-4">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Question ${index + 1}`}
                                    required={true}
                                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(index)}
                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="mb-4 px-2 py-1 bg-green-500 text-white rounded"
                    >
                        + Add Question
                    </button>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Submit Poll
                    </button>
                </form>
                </div>
            )}
        </div>
    )
}