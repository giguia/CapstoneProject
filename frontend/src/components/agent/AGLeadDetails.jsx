const AGLeadDetails = ({ lead }) => {

    return (
      <div className="lead-table">
        <table border={0} cellSpacing={0}>
        <thead>
          <tr>
          <th scope="col"><strong>ID</strong></th>
            <th scope="col"><strong>Name</strong></th>
            <th scope="col"><strong>Type</strong></th>
            <th scope="col"><strong>Phone Number</strong></th>
            <th scope="col"><strong>Email Address</strong></th>
            <th scope="col"><strong>Lead Gen Date</strong></th>
            <th scope="col"><strong>Last Visit</strong></th>
            <th scope="col"><strong>Call Disposition</strong></th>
            <th scope="col"><strong>Remarks</strong></th>
            <th scope="col"><strong>Actions</strong></th>
            </tr>
            </thead>
        </table>
      </div>
    )
  }
  
  export default AGLeadDetails
