import './Main.css';

function Main() {
  return (
    <div className="Main">
      <header className="Main-header">
      <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/profile">My Profile</a></li>
            <li><a href="/logout">Logout</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
      </header>

      <div className='content'></div>
      <footer className='footer'>Website Footer</footer>
    </div>
  );
}

export default Main;
