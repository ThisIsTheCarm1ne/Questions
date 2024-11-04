import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

interface IPoll {
    id: number;
    name: string;
    questions: string[];
    votes: number[];
    createdAt: Date;
    updatedAt: Date;
}

//Everything works well, unless you put '1' here
//If you do - then loading message starts flickering
//I don't want to fix it as it's almost 3 AM
//And why would somebody ever put this number to 1??????
const PollsToLoadConst = 3;

export default function PollList() {
    const [polls, setPolls] = useState<IPoll[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const observerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        // WebSocket setup
        socket.on('pollUpdated', (updatedPoll: IPoll) => {
            setPolls(prevPolls =>
                (prevPolls ?? []).map(poll => (poll.id === updatedPoll.id ? updatedPoll : poll))
            );
        });

        return () => {
            socket.off('pollUpdated');
        };

    }, []);

    const fetchPolls = useCallback(async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/polls/${page * PollsToLoadConst}/${(page + 1) * PollsToLoadConst}`
            );
            const data = await response.json();

            if (!data.success && data.data.length === 0) throw new Error("Could not fetch Polls");

            setPolls(prevPolls => [...(prevPolls || []), ...data.data]);

            setPage(prevPage => prevPage + 1);

            if (data.data.length < PollsToLoadConst) {
                setHasMore(false); // No more polls to load
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    // Intersection Observer setup
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !loading) {
                    fetchPolls();
                }
            },
            { threshold: 1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchPolls, loading]);

    const handleVote = (pollId: number, questionIndex: number) => {
        socket.emit('vote', { pollId, questionIndex });
    };

    return (
        <div className="flex flex-col gap-10 w-1/3">
            {polls === null ? (
                <div>No polls available.</div>
            ) : (
                polls.map((poll, key) => (
                    <div key={key} className="w-full">
                        <div className="w-full bg-red-600 mb-3 rounded-lg text-2xl">
                            {poll?.name}
                        </div>
                        <div className="flex flex-col gap-3">
                            {poll?.questions.map((question, keyQuestion) => (
                                <button
                                    key={keyQuestion}
                                    className="h-10 relative border border-black rounded"
                                    onClick={() => handleVote(poll.id, keyQuestion)}
                                >
                                    <div
                                        className="h-full absolute inline-block left-0 top-0 rounded"
                                        style={{
                                            backgroundColor: "pink",
                                            width: `${(poll?.votes.filter(vote => vote === keyQuestion).length / poll?.votes.length) * 100}%`
                                        }}
                                    >
                                    </div>
                                    <span className="relative top-0 z-10">{question} {poll?.votes.filter(vote => vote === keyQuestion).length}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Loader div for intersection observer */}
            <div ref={observerRef} className="loader">
                {loading && <p>Loading more polls...</p>}
            </div>
        </div>
    )
}