import React from 'react'
import UpdateLeadForm from '../../components/leadgen/UpdateLeadForm'

const EditForm = ({ leadId }) => {
    return (
        <div>
            <UpdateLeadForm leadId={leadId}/>
        </div>
    );
}

export default EditForm