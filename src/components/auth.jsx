import React from "react";


const Auth = props => {

    const {authFun, handleInputChange, handlePasswordChange,  authPage, errorMsg} = props;

  return (
    <div className="submit-form">
        <h1>{errorMsg.substring(1, errorMsg.length-1)}</h1>
      <form onSubmit={authFun} >
          {authPage === 'signUp' &&
          <>
            <label htmlFor="name">Username</label>
            <div className="input-group col-lg-4">
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    required
                    onChange={handleInputChange}
                    name="name"
                />
                </div>
        </>
        }
        <label htmlFor="id">email</label>
        <div className="input-group col-lg-4">
          <input
            type="email"
            className="form-control"
            id="id"
            required
            onChange={handleInputChange}
            name="id"
          />
        </div>

        <label htmlFor="password">password</label>
        <div className="input-group col-lg-4">
          <input
            type="password"
            className="form-control"
            id="password"
            required
            onChange={handlePasswordChange}
            name="password"
          />
        </div>

        <button className="btn btn-success submit-btn">
        {authPage}
        </button>
        </form>
    </div>
  );
};

export default Auth;
