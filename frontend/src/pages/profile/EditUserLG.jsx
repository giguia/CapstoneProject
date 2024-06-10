import React from 'react'
import UpdateUserLG from '../../components/profile/UpdateUserLG'

const EditUserLG = ({ userId }) => {
    return (
        <div className="EditForm">
            <UpdateUserLG userId={userId} />
        </div>
    );
}

export default EditUserLG