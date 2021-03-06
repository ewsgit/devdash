import React from "react";
import { NextRouter, withRouter } from "next/router";
import Head from "next/head";
import localForage from "localforage";

class Component extends React.Component<{ router: NextRouter }> {
  interval: number | undefined;
  iteration: number = 0;

  state: {
    failed: boolean;
    iteration: number;
  } = { failed: false, iteration: 0 };

  componentDidMount() {
    let authenticated = false;

    // fetch user from GitHub
    let windowQuery = new URLSearchParams(window.location.search);
    let githubToken = windowQuery.get("token");
    fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `token ${githubToken}`,
      },
      method: "GET",
    })
      .then(res => {
        if (res.status === 200) {
          authenticated = true;
          return res.json();
        } else {
          this.setState({
            failed: true,
          });
          setTimeout(() => {
            this.props.router.push("/");
          }, 5000);
        }
      })
      .then(res => {
        localForage.setItem("githubToken", githubToken);
        localForage.setItem("githubUser", res);
        this.props.router.push("/app");
      });
  }

  render() {
    return (
      <div className={`w-full h-screen bg-content-normal flex items-center justify-center flex-col`}>
        <Head>
          <title>DevDash - Authentication in progress...</title>
        </Head>
        <h1 className={`text-text-primary text-4xl max-w-[90%] text-center`}>
          {this.state.failed ? "Authentication has failed." : "Authentication in progress..."}
        </h1>
        {this.state.failed ? (
          <>
            <h2 className={`text-2xl text-text-primary mt-4`}>
              <span className={`font-bold tracking-wider text-red-400`}>ERROR: </span>
              An issue has occured
            </h2>
            <h2 className={`text-xl text-text-primary mt-20`}>Redirecting to home shortly</h2>
          </>
        ) : null}{" "}
        {!this.state.failed ? (
          <div className={`flex items-center relative justify-center mt-5 aspect-square h-12 overflow-hidden`}>
            <div className={`h-16 w-4 absolute bg-branding-primary animate-pulse-spin`}></div>
            <div
              className={`bg-content-normal overflow-hidden opacity-50 w-8 aspect-square rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 origin-center flex items-center justify-center`}>
              <div className={`w-4 h-full animate-pulse-spin relative origin-center`}>
                <div
                  className={`w-4 aspect-square bg-yellow-200 opacity-50 transition-all absolute animate-top-bottom`}></div>
              </div>
            </div>
            <div
              className={`border-[0.75rem] border-solid border-content-normal w-[4.25rem] aspect-square rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}></div>
            <div className={`h-12 animate-spin-slower flex items-center justify-center`}>
              <div className={`w-4 aspect-square bg-content-normal rotate-45`}></div>
              <div className={`w-4 ml-[0.45rem] aspect-square bg-content-normal rotate-45`}></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Component);
