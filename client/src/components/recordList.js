import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
    <tr>
        <td>{props.record.person_name}</td>
        <td>{props.record.person_position}</td>
        <td>{props.record.person_level}</td>
        <td>
            <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
            <button className="btn btn-link"
                onClick={() => {
                    props.deleteRecord(props.record._id);
                }}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default function RecordList() {
    const [records, setRecords] = useState([]);

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5500/record/`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            console.log('Records:', records);
            setRecords(records);
        }

        getRecords();

        return;
    }, [records.length]);

    // This method will delete a record

    async function deleteRecord(id) {
        console.log('deleting', id);
        const response = await fetch(`http://localhost:5500/${id}`, {
            method: "DELETE"
        });
        console.log('delete response', response);
        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
    }

    async function _deleteRecord(id) {
        console.log('deleting record', id);
        const url = `http://localhost:5500/delete/${id}`;
        console.log(url);
        const response = await fetch(url, {
            method: "POST"
        });
        console.log('done with fetch', response);
        const newRecords = records.filter((el) => el._id !== id);
        console.log('new records:', newRecords);
        setRecords(newRecords);
    }

    // This method will map out the records on the table
    function recordList() {
        return records.map((record) => {
            console.log(record)
            return (
                <Record
                    record={record}
                    deleteRecord={() => deleteRecord(record._id)}
                    key={record._id}
                />
            );
        });
    }

    // This following section will display the table with the records of individuals.
    return (
        <div>
            <h3>Record List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Level</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}