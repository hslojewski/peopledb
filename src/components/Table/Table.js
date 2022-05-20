import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import './Table.css';

const React = require('react'),
      $ = require('jquery'),
      { useState, useEffect } = require('react');

function Table() {
  const [people, setPeople] = useState([]);
  const [peopleNotes, setPeopleNotes] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [visibleNotes, setVisibleNotes] = useState([]);
  const [formErrors, setFormErrors] = useState({required:[],format:[]});

  useEffect(() => {
    refreshPeopleNotesData();
  }, [])

  var refreshPeopleData = () => {
    fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS")
      .then(res => res.json())
      .then(
        (result) => {
          setPeople(result.records);
        },
        (error) => {
          return error;
        }
      )
  }

  var refreshPeopleNotesData = () => {
    fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes?api_key=keyK2FU3DKzVm9DNS")
      .then(res => res.json())
      .then(
        (result) => {
          var notesList = result.records;
          var notesObj = {};
          notesList.forEach(note => {
            notesObj[note.id] = note;
          })
          setPeopleNotes({...notesObj});
          refreshPeopleData();
        },
        (error) => {
          return error;
        }
      )
  }

  var putRecord = (type, data, dataId) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "PUT",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
        data: data,
        dataType: "html",
        success: function(data) {
          console.log('success');
          refreshPeopleData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var postRecord = (type, data) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "POST",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"?api_key=keyK2FU3DKzVm9DNS",
        data: data,
        dataType: "html",
        success: function(data) {
          console.log('success');
          refreshPeopleNotesData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var deleteRecord = (type, dataId) => {
    $.ajax({
        type: "DELETE",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
        dataType: "html",
        success: function(data) {
          console.log('success');
          refreshPeopleData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var changeEditMode = (e) => {
    console.log(e);
    console.log(people);
    setEditMode(e.target.id);
  };

  var toggleNotes = (e) => {
    console.log(e);
    console.log(people);
    var newNotes;
    if (visibleNotes.includes(e.target.id)) {
      newNotes = visibleNotes.filter(function(note) {
        return note !== e.target.id
      })
    } else {
      newNotes = visibleNotes;
      newNotes.push(e.target.id);
    }
    setVisibleNotes([...newNotes]);
  };

  var removeFromEditMode = (e) => {
    console.log(e);
    e.preventDefault();
    var blah = {};
    $("#form_"+e.target.id).serializeArray().forEach(item => {
      if (item.value) {
        console.log(people);
        // debugger;
        if (item.name === "peopleNotes") {
          blah[item.name] = item.value.split(",");
        } else {
          blah[item.name] = item.value;
        }
      }
    })
    console.log(blah);
    putRecord("People", {fields: blah}, e.target.id);
    setEditMode(null);
  };

  var removeFromNoteEditMode = (e) => {
    console.log(e);
    e.preventDefault();
    var blah = {};
    $("#form_"+e.target.id).serializeArray().forEach(item => {
      // peopleNotes[e.target.id].peopleId;
      if (item.value) {
        blah[item.name] = item.value;
        blah.peopleId = peopleNotes[e.target.id].fields.peopleId;
      }
      console.log(people);
    })
    console.log(blah);
      // debugger;
    putRecord("PeopleNotes", {fields: blah}, e.target.id);
    setEditMode(null);
  };

  var deletePerson = (e) => {
    deleteRecord("People", e.target.id);
  };

  var deleteNote = (e) => {
    deleteRecord("PeopleNotes", e.target.id);
  };

  var createNewPerson = (e) => {
    console.log(e);
    e.preventDefault();
    var blah = {};
    $("#new-person").serializeArray().forEach(item => {
      if (item.value) {
        console.log(people);
        // debugger;
        // if (item.name === "peopleNotes") {
        //   blah[item.name] = item.value.split(",");
        // } else {
          blah[item.name] = item.value;
        // }
      }
    })
    console.log(blah);
    postRecord("People", {fields: blah});
    // setEditMode(null);
  };

  var createNewNote = (e) => {
    console.log(e);
    e.preventDefault();
    var blah = {};
    $("#new-note").serializeArray().forEach(item => {
      if (item.value) {
        console.log(people);
        // debugger;
        if (item.name === "peopleId") {
          blah[item.name] = [item.value];
        } else {
          blah[item.name] = item.value;
        }
      }
    })
    console.log(blah);
    postRecord("PeopleNotes", {fields: blah});
    // setEditMode(null);
  };

  var sort = (e) => {
    console.log(e);
    console.log("before:",people);
    // debugger;
    // if (e.target.id === "createdTime") {
    //   debugger;
    // }
    var blah = people.sort((a,b)=> (a[e.target.id] - b[e.target.id] ? 1 : -1));
    setPeople([...blah]);
    console.log("after:",people);
  };

  var hasFormErrors = (data) => {
    // var requiredFields = ["name", "birthday", "zipCode"];
    var requiredFields = ["name", "birthday"];
    var missingFields = [];
    var wrongFormats = [];
    requiredFields.forEach(requiredField => {
      // debugger;
      if (!Object.keys(data.fields).includes(requiredField)) {
        missingFields.push(requiredField);
      }
    });
    if (data.fields.zipCode && isNaN(data.fields.zipCode) && data.fields.zipCode.toString().length !== 5) {
      wrongFormats.push("zipCode");
    }

    if (!missingFields.length && !wrongFormats.length) {
      $("#new-person input[type=text]").val("");
    }

    setFormErrors({...formErrors, required: missingFields, format: wrongFormats});
  }

  return (
    <div className="Table">
    <h4>People</h4>
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col" id="name" onClick={sort}>
            Name <i className="bi bi-arrow-down-up" />
          </th>
          <th scope="col" id="birthday" onClick={sort}>
            Birthday <i className="bi bi-arrow-down-up" />
          </th>
          <th scope="col" id="zipCode" onClick={sort}>
            Zip Code <i className="bi bi-arrow-down-up" />
          </th>
          <th scope="col" id="createdTime" onClick={sort}>
            Created Time <i className="bi bi-arrow-down-up" />
          </th>
          <th scope="col" id="modifiedTime" onClick={sort}>
            Modified Time <i className="bi bi-arrow-down-up" />
          </th>
          <th>Notes</th>
          <th>Edit/Save</th>
          <th>Delete</th>
        </tr>
      </thead>
        {Object.entries(people).map(([personId, person]) => {
          console.log('formErrors:',formErrors);
          var inEditMode = editMode === person.id;
          var formId = "form_"+person.id;
          var personNotes = [];
          if ((person.fields.peopleNotes || []).length) {
            person.fields.peopleNotes.forEach(noteId => {
              personNotes.push(peopleNotes[noteId]);
            });

          }
          var isNotesVisible = visibleNotes.includes(person.id);
          console.log("inEditMode:",inEditMode);
          console.log("isNotesVisible:",isNotesVisible);
          return (
            <tbody>
            <tr>
              <td style={{display: 'none'}}>
                <form type="hidden" key={personId} id={formId}></form>
              </td>
              <td>
                {inEditMode && <input className="form-control" form={formId} type="text" name="name" defaultValue={person.fields.name}></input>}
                {!inEditMode && <span>{person.fields.name}</span>}
              </td>
              <td>
                {inEditMode && <input className="form-control" form={formId} type="text" name="birthday" defaultValue={person.fields.birthday}></input>}
                {!inEditMode && <Moment format="MM/DD/YYYY">{person.fields.birthday}</Moment>}
              </td>
              <td className="center">
                {inEditMode && <input className="form-control" form={formId} type="text" name="zipCode" defaultValue={person.fields.zipCode}></input>}
                {!inEditMode && <span>{person.fields.zipCode}</span>}
              </td>
              <td className="center">
                <Moment format="YYYY-MM-DD HH:mm">{person.fields.createdTime}</Moment>
              </td>
              <td className="center">
                <Moment format="YYYY-MM-DD HH:mm">{person.fields.modifiedTime}</Moment>
              </td>
              <td style={{display: 'none'}} className="center">
                <input className="form-control" form={formId} type="text" hidden name="peopleNotes" defaultValue={person.fields.peopleNotes}></input>
              </td>
              <td className="center">
                {!!personNotes.length &&
                  <span>
                    {!isNotesVisible &&
                      <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                        Open <i className="bi bi-eye-fill" />
                      </a>
                    }
                    {!!isNotesVisible &&
                      <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                        Close <i className="bi bi-eye-slash-fill" />
                      </a>
                    }
                  </span>
                }
                {!personNotes.length &&
                  <span>
                    {!isNotesVisible &&
                      <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                        Add +
                      </a>
                    }
                    {!!isNotesVisible &&
                      <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                        Cancel <i className="bi bi-journal-x" />
                      </a>
                    }
                  </span>
                }
              </td>
              <td className="center">
                {!inEditMode && <a id={person.id} onClick={changeEditMode} className="btn btn-secondary">
                  Edit <i className="bi bi-pencil-fill" />
                </a>}
                {inEditMode && <a type="submit" id={person.id} onClick={removeFromEditMode} className="btn btn-secondary">
                  Save <i className="bi bi-save-fill" />
                </a>}
              </td>
              <td className="center">
                <a id={person.id} onClick={deletePerson} className="btn btn-danger">
                  Delete <i className="bi bi-trash-fill" />
                </a>
              </td>
            </tr>
            {!!isNotesVisible &&
              <tr>
                <td colSpan="8">
                {!!personNotes.length && !!isNotesVisible &&
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Note</th>
                        <th>Created Time</th>
                        {/* <th>Edit/Save</th> */}
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personNotes.map(note => {
                        var inNoteEditMode = editMode === note.id;
                        var noteFormId = "form_"+note.id;
                        return(
                          <tr>
                            <td style={{display: 'none'}}>
                              <form type="hidden" key={note.id} id={noteFormId}></form>
                            </td>
                            <td className="note-input">
                              {inNoteEditMode && <input className="form-control" form={noteFormId} type="text" name="note" defaultValue={note.fields.note}></input>}
                              {!inNoteEditMode && <span>{note.fields.note}</span>}
                            </td>
                            <td>
                              <Moment format="YYYY-MM-DD HH:mm">{note.fields.createdTime}</Moment>
                            </td>
                            {/* <td>
                              {!inNoteEditMode && <a id={note.id} onClick={changeEditMode} title="Edit" className="bi bi-pencil-fill"></a>}
                              {inNoteEditMode && <a type="submit" id={note.id} onClick={removeFromNoteEditMode} title="Save" className="bi bi-save-fill"></a>}
                            </td> */}
                            <td className="center">
                              <a id={note.id} onClick={deleteNote}  className="btn btn-danger">
                                Delete <i className="bi bi-trash-fill" />
                              </a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  }
                  <form key="new-note" id="new-note" className="row">
                    <input type="hidden" name="peopleId" value={person.id}></input>
                    <span className="col col-1">New Note:</span>
                    <input className="col form-control" type="text" name="note" placeholder="Message"></input>
                    <div className="col col-1">
                      <a type="submit" onClick={createNewNote} className="btn btn-primary">
                        Save <i className="col bi bi-save-fill" />
                      </a>
                    </div>
                  </form>
                </td>
              </tr>
            }
            </tbody>
          )
        })}
        </table>

        <br/><br/><br/><br/>

        <h4>Create New Person</h4>
        <form key="new-person" id="new-person" className="row g-3 needs-validation">
          <div class="col-md-5">
            <label for="name" class="form-label">Name</label>
            <input id="name" className="col form-control col-md-4" type="text" name="name" required></input>
            <div style={{display:formErrors.required.includes("name") ? "block" : "none"}} className="invalid-feedback">Name is required.</div>
          </div>
          <div class="col-md-3">
            <label for="birthday" class="form-label">Birthday</label>
            <input id="birthday"className="col form-control col-md-4" type="text" name="birthday" placeholder="mm/dd/yyyy" required></input>
            <div style={{display:formErrors.required.includes("birthday") ? "block" : "none"}} className="invalid-feedback" required>Birthday is required.</div>
          </div>
          <div class="col-md-3">
            <label for="zipCode" class="form-label">Zip Code</label>
            <input id="zipCode"className="col form-control col-md-4" type="text" name="zipCode"></input>
            <div style={{display:formErrors.required.includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code is required.</div>
            <div style={{display:formErrors.format.includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code must be a 5 digit number.</div>
          </div>
          <div class="col-md-2">
            <button type="submit" onClick={createNewPerson} className="col btn btn-primary">Save <i className="bi bi-save-fill" /></button>
          </div>
        </form>
    </div>
  );
}

export default Table;
