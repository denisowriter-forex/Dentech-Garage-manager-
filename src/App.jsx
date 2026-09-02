import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Dentech Garage Manager</h1>
          <p>Innovation Through Craftsmanship</p>
        </div>

        <div className="business">
          Dentech Expertise Premier
        </div>
      </header>

      <main>
        <section className="welcome">
          <h2>Garage Dashboard</h2>
          <p>
            Manage your customers, vehicles, jobs, invoices and payments.
          </p>
        </section>

        <section className="cards">
          <div className="card">
            <h3>Customers</h3>
            <strong>0</strong>
            <p>Registered customers</p>
          </div>

          <div className="card">
            <h3>Vehicles</h3>
            <strong>0</strong>
            <p>Vehicles registered</p>
          </div>

          <div className="card">
            <h3>Active Jobs</h3>
            <strong>0</strong>
            <p>Jobs currently in progress</p>
          </div>

          <div className="card">
            <h3>Outstanding</h3>
            <strong>KSh 0</strong>
            <p>Customer balances</p>
          </div>
        </section>

        <section className="services">
          <h2>Dentech Services</h2>

          <div className="service-list">
            <div>🔧 Automotive Service</div>
            <div>🚛 Truck Maintenance</div>
            <div>🛠️ Fiberglass Fabrication</div>
            <div>🎨 Spray Painting</div>
            <div>📦 Fiberglass Cargo Bodies</div>
            <div>🚗 Vehicle Sales</div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Dentech Expertise Premier</p>
      </footer>
    </div>
  );
}

export default App;