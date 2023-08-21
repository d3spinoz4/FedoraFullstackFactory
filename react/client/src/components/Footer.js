
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <p>When task is green Double Click to download results</p>
      <p>Copyright &copy; 2021</p>
      <Link to='/about'>About</Link>
    </footer>
  )
}

export default Footer

