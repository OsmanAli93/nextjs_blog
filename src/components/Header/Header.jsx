"use client";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { LOGOUT_USER } from "../../constants";
import { useRouter } from "next/navigation";
import axiosInstance from "../../services/axiosInstance";

const Header = ({ access_token, user, logout }) => {
  const navigate = useRouter();
  console.log(user);

  const setDefaultHeaders = (access_token) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
  };

  return (
    <Navbar rounded>
      <Navbar.Brand href="/">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Flowbite React
        </span>
      </Navbar.Brand>
      {!access_token && !user ? (
        <Navbar.Toggle />
      ) : (
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={true}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                setDefaultHeaders(access_token);
                logout(navigate);
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>

          <Navbar.Toggle />
        </div>
      )}

      <Navbar.Collapse>
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
        {!access_token && !user ? (
          <Navbar.Link href="/auth/login">Login</Navbar.Link>
        ) : (
          <Navbar.Link href="#">Post</Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => {
  return {
    access_token: state.auth.access_token,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (navigate) => dispatch({ type: LOGOUT_USER, navigate }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
