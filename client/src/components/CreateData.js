import { useState } from "react";
import { useCreateDataMutation } from "../features/data/dataApiSlice";

const CreateData = () => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createData] = useCreateDataMutation();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            await createData(title);
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title"> Insert Title</label>
                <input
                    id="title"
                    placeholder="title"
                    onChange={e => setTitle(e.target.value)}
                />
                <button>Submit</button>
            </form>
            {loading && <h1>Loading...</h1>}
            {success && <h1>data submitted.</h1>}
        </div>
    );
};

export default CreateData;
