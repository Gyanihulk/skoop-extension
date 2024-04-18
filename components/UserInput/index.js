import React, { Component, useEffect, useState } from 'react'
import API_ENDPOINTS from '../apiConfig'
import { MdOutlineDone } from 'react-icons/md'
import toast from 'react-hot-toast'

export class UserInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoTitle: '',
      directoryName: '',
      listOfDirectories: [],
      selectedOption: 'none',
      loading: true,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    try {
      const response = await this.getDirectories()
      this.setState(
        {
          listOfDirectories: response,
        },
        () => {
          this.setState({
            loading: false,
          })
        }
      )
    } catch (err) {
      console.log('something went wrong')
    }
  }

  async getDirectories() {
    var response = await fetch(API_ENDPOINTS.videoDirectories, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem('accessToken')
        )}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    response = await response.json()
    return response
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    var drName =
      this.state.selectedOption == 'none'
        ? this.state.directoryName
        : this.state.selectedOption
    this.props.sharingDetails(this.state.videoTitle, drName)
  }
  render() {
    if (this.state.loading == false) {
      return (
        <div className="customPosition">
          <div className="container-fluid customContainerFluid">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="videoTitle">Video Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="videoTitle"
                  name="videoTitle"
                  placeholder=""
                  value={this.state.videoTitle}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="selectedOption">Select Folder</label>
                <select
                  className="form-control"
                  id="selectedOption"
                  name="selectedOption"
                  value={this.state.selectedOption}
                  onChange={this.handleChange}
                >
                  <option value="none">
                    <em>Choose or Create Folder</em>
                  </option>
                  {this.state.listOfDirectories.map((item) => (
                    <option
                      key={item.directory_name}
                      value={item.directory_name.toString()}
                    >
                      {item.directory_name.toString()}
                    </option>
                  ))}
                </select>
              </div>

              {this.state.selectedOption === 'none' && (
                <div className="form-group">
                  <label htmlFor="directoryName">Enter New Folder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="directoryName"
                    name="directoryName"
                    placeholder=""
                    value={this.state.directoryName}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              )}

              <div className="d-flex justify-content-end pt-3 gap-2">
                <button type="submit" className="btn btn-primary button-size">
                  Upload
                </button>
                <button
                  type="button"
                  className="btn btn-secondary button-size"
                  onClick={this.props.cancelUpload}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <br />
          <br />
        </div>
      )
    }
  }
}

export const NewFolderInput = (props) => {
  const [values, setValues] = useState({
    directoryName: '',
  })

  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }
  const CreateNewDirectory = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.addNewDirectory, {
        method: 'POST',
        body: JSON.stringify({
          directory: values.directoryName,
        }),
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (res.ok) {
        props.closePopup()
        setValues({
          directoryName: '',
        })
      } else throw 'error in the database'
    } catch (err) {
      toast.error('some error occured during update')
    }
  }
  const renameDirectory = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.renameFolder, {
        method: 'PATCH',
        body: JSON.stringify({
          oldDirectoryName: props.oldDirectoryName,
          newDirectoryName: values.directoryName,
        }),
        headers: {
          authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (res.ok) {
        props.closePopup()
        setValues({
          directoryName: '',
        })
      }
    } catch (err) {
      toast.error('some error occurred')
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (props.oldDirectoryName) {
      await renameDirectory()
      return
    }
    await CreateNewDirectory()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control w-75 custom-input-global"
            name="directoryName"
            onChange={handleChange}
            value={values.directoryName}
            placeholder="Enter folder name"
            required
          />
          <button type="submit" className="modal-btn ms-2 px-4">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
