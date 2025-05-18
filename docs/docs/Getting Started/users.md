---
sidebar_position: 7
title: User Management
---

# User Management

StoryCanvas includes user roles and a simple interface for managing users.

---

## Who Can Access the Users Page?

Both **administrators** and **editors** can access the list of users.

You can navigate to the Users page from:

- The **sidebar** (click "Users")
- The **dashboard homepage** via the “Users” card

This page is located at:  
`/admin/dashboard/users`

---

## Viewing Users

All users can see:

- Email addresses
- Roles (`admin` or `editor`)
- Date created

> Editors can **only view** user accounts.  
> Administrators can **create and delete** users.

---

## Creating a New User

Only **administrators** can create users.

### 1. Open the Users page  
Go to `/admin/dashboard/users`.

### 2. Click `New User`  
This opens a form to create the user.

### 3. Fill in the user details

- **Email**
- **Password**
- **Confirm Password**
- **Role** (select between `admin` and `editor`)

Click `Create` to submit the form.

> The new user will be added and can log in immediately.

---

## Deleting a User

Only **administrators** can delete other users from the same page.


### 2. Open the action menu

Locate the user you want to delete in the list.  
Click the **three dots (···)** at the end of the row to open the **action menu**.

---

### 3. Click "Delete"

From the dropdown, select **`Delete`**.

A **confirmation modal** will appear asking if you're sure you want to delete the user.

> This step helps prevent accidental deletion.

---

### 4. Confirm the deletion

In the modal, click **`Delete`** to proceed.

The user will be deleted immediately.

> ⚠️ Admins **cannot delete themselves.**

---

## Notes

- Email addresses must be unique
- Passwords must meet validation requirements.
- User roles are assigned on creation and cannot be changed (yet)