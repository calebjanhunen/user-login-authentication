import React from "react";
import { Link } from "react-router-dom";

import {
    useGetDataQuery,
    useDeleteDataMutation,
} from "../features/data/dataApiSlice";
import Navbar from "./Navbar";

const Data = () => {
    const { data, isLoading, isSuccess, isError, error } = useGetDataQuery();
    const [deleteData] = useDeleteDataMutation();

    let content;
    if (isLoading) {
        content = <p>Loading</p>;
    } else if (isSuccess) {
        content = (
            <div>
                <h1>Data</h1>
                <ul>
                    {data.data.map(singleData => {
                        return (
                            <li key={singleData._id}>
                                {singleData.title}
                                <button
                                    onClick={() => deleteData(singleData._id)}
                                >
                                    Trash
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    } else if (isError) {
        content = <p>{error}</p>;
    }
    return (
        <>
            <Navbar />
            {content}
        </>
    );
};

export default Data;
