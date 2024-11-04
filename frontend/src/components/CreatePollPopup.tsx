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

        if (questions.length === 0) {
            console.log("No Questions Set");
            return
        }
        const payload = {
            name: title,
            questions: questions,
            votes: []
        };

        try {
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
                className="border-2 border-baclk rounded mb-10"
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
                            <div key={index} className="flex items-center mb-4 content-center justify-center flex-wrap">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Question ${index + 1}`}
                                    required={true}
                                    className="p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(index)}
                                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded h-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
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