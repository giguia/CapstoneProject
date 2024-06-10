import { Link } from 'react-router-dom'
import { useLogoutLG } from '../../hooks/useLogoutLG'
import { useAuthContext } from '../../hooks/useAuthContext'

const Navbar = () => {
  const { logoutLG } = useLogoutLG()
  const { userLG } = useAuthContext()


  const handleClick = () => {
    logoutLG()
  }

  return (
    <header>
      <div className="container">

        <nav className="nar">
          {userLG && (
            <div>
              <Link to={`/viewuser/${userLG._id}`}>Profile</Link>
              <span>{userLG.isActive ? 'Inactive' : 'Active'}</span>
              <button onClick={handleClick}><i className="fa-solid fa-right-from-bracket"></i>Log Out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar