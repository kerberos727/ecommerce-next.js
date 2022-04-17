import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'

import moment from 'moment'
import { Alert } from '@mui/material'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CircularProgress from '@mui/material/CircularProgress'

import { truncate, format } from 'utils'
import { PaginationComponent as Pagination, ModalComponent as Modal } from 'components'

import { getUsers, restDeleteUser, deleteUser } from 'global-states/actions'
import { ReducerType } from 'global-states'
import { UserType } from 'types'

export function AdminUserSTablePage(props: any) {
  const {
    users,
    list,
    totalDocs,
    listIsLoading,
    listIsSuccess,
    listIsError,
    listMessage,
    deleteUserIsPending,
    deleteUserIsSuccess,
    deleteUserIsError,
    deleteUserMessage,
  } = props.listState
  const router = useRouter()
  const [addNewUser, setAddNewUser] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(100)
  const [page, setPage] = useState<number>(1)
  const [open, setOpen] = useState<boolean>(false)
  const [id, setId] = useState<string | undefined>()
  const [showAlert, setShowAlert] = useState<boolean>(false)

  useEffect(() => {
    const filteredUrl = `/admin/users?page=${page}&limit=${limit}`
    props.getUsers(filteredUrl)
  }, [page, limit])

  useEffect(() => {
    if (deleteUserIsSuccess || deleteUserIsError) {
      setShowAlert(() => true)
      setOpen(() => false)

      const timer = setTimeout(() => {
        setShowAlert(() => false)
        props.restDeleteUser()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [deleteUserIsSuccess, deleteUserIsError])

  useEffect(() => {
    const redirectToSignUp = () => {
      if (addNewUser) {
        router.push('/admin/users/add-user')
      }
    }
    redirectToSignUp()
  }, [addNewUser])

  if (addNewUser) {
    router.push('/admin/users/add-user')
  }

  const handleChange = (event: any, value: number) => {
    setPage(value)
  }

  const handleOpen = (givenId: string) => {
    setId(() => givenId)
    setOpen(() => true)
  }

  const handleClose = () => setOpen(false)

  const handleDelete = (userId:string) => {
    if (userId) {
      props.deleteUser(userId)
    }
  }

  return (
    <div>
      <div className="text-[18px] max-w-[1250px] mx-auto p-5 mt-11 min-h-[200px]  ">
        <div className="flex flex-col max-h-[80vh]">
          {listIsLoading && (
            <div className=" flex items-center justify-center ">
              <CircularProgress color="secondary" />
            </div>
          )}

          {!listIsLoading && (
            <>
              {showAlert && (
                <Alert
                  variant="filled"
                  severity={deleteUserIsError ? 'error' : 'success'}
                  onClose={() => setShowAlert(false)}
                >
                  {deleteUserMessage}
                </Alert>
              )}

              <Modal handleOpen={handleOpen} handleClose={handleClose} open={open} id={id} deleteUser={handleDelete} deleteUserIsPending={deleteUserIsPending} />
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow-md sm:rounded-lg">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => setAddNewUser(true)}
                        className="bg-blue-500 text-white hover:bg-blue-400  font-bold py-2 px-4 rounded inline-flex items-center"
                      >
                        <span>Add New User</span>
                      </button>
                      {totalDocs > 0 && <Pagination handleChange={handleChange} page={page} totalPages={totalDocs} />}
                    </div>
                    <div />
                    <table className="min-w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 font-bold">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs  tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs  tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            FirstName
                          </th>

                          <th
                            scope="col"
                            className="py-3 px-6 text-xs tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            lastName
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Email
                          </th>

                          <th
                            scope="col"
                            className="py-3 px-6 text-xs tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Gender
                          </th>

                          <th
                            scope="col"
                            className="py-3 px-6 text-xs  tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Date Of Birth
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Edit
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-6 text-xs  tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                          >
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users &&
                          users.map((user: any, index: number) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {index + 1}
                              </td>

                              <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.firstName}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {user.lastName}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {truncate(user.email, 20)}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {user.gender}
                              </td>

                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {user.dateOfBirth}
                              </td>

                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {user.role}
                              </td>

                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                <Link href={`/admin/users/${user._id}`}>
                                  <Button variant="outlined" startIcon={<EditIcon />}>
                                    Edit
                                  </Button>
                                </Link>
                              </td>

                              <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                <Button
                                  color="warning"
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => {
                                    handleOpen(user._id)
                                  }}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: ReducerType) => ({
  listState: state.users,
})

const mapDispatchToProps = {
  getUsers,
  restDeleteUser,
  deleteUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminUserSTablePage)