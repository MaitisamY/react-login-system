import { Link } from "react-router-dom";

export default function Terms() {
  return (
        <div className="card col-sm-10 col-md-6 col-lg-4 col-xl-3 col-xxl-3 box-shadow bg-transparent">
            <div className="card-header bg-white p-3">
                <h3 className="card-title">Terms and Conditions</h3>
                <small className="card-text">
                    System build upon Bootstrap, React, Node, Express and PostgreSQL.
                </small>
            </div>
            <div className="card-body">
                <ul>
                    <li>We store your data in PostgreSQL.</li>
                    <li>We use JWT for authentication.</li>
                </ul>
            </div>
            <div className="card-footer bg-white">
                <div className="d-grid gap-2">
                    <Link to="/login" className="btn btn-dark">Back to Login</Link>
                </div>
            </div>
        </div>
  )
}
