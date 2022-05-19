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
    // refreshPeopleData();
    refreshPeopleNotesData();
  }, [])

  $('.bleh').on('click', (e) => {
    e.preventDefault();
    $('.bleh').unbind();
    // $.ajax({
    //     type: "POST",
    //     datatype : "application/json",
    //     async: true,
    //     url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS",
    //     data: ({
    //       // id: "recqTAdGUfDNCE8fX",
    //       fields: {
    //         name: "Minnie Test 2",
    //         // birthday: "1928-11-28",
    //         // peopleNotes: [
    //         //   "recKCy23rn1IWKzXR",
    //         // ]
    //         // zipCode: 90210
    //       }
    //     }),
    //     dataType: "html",
    //     success: function(data) {
    //       console.log('success');
    //       fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS")
    //         .then(res => res.json())
    //         .then(
    //           (result) => {
    //             var peopleList = result.records;
    //             setPeople(peopleList);
    //           },
    //           (error) => {
    //             return error;
    //           }
    //         )
    //     },
    //     error: function(error) {
    //       console.log(error.responseText);
    //     }
    // });
    $.ajax({
        type: "POST",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes?api_key=keyK2FU3DKzVm9DNS",
        data: ({
          // id: "recqTAdGUfDNCE8fX",
          fields: {
            // noteId: 1,
            note: "Mickey was the Walt Disney Company's first character. He's amazing!",
            peopleId: [ "reczLL6THxiiEaAtZ" ]
          }
        }),
        dataType: "html",
        success: function(data) {
          console.log('success');
          fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS")
            .then(res => res.json())
            .then(
              (result) => {
                // var peopleList = result.records;
                // setPeople(peopleList);
              },
              (error) => {
                return error;
              }
            )
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  })

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

  var putRecord = (data, dataId) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "PUT",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
        data: data,
        dataType: "html",
        success: function(data) {
          console.log('success');
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var putNoteRecord = (data, dataId) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "PUT",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
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

  var postPersonRecord = (data) => {
    // debugger;
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "POST",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS",
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

  var postPersonNoteRecord = (data) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "POST",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes?api_key=keyK2FU3DKzVm9DNS",
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

  var deletePersonRecord = (dataId) => {
    $.ajax({
        type: "DELETE",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
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

  var deleteNoteRecord = (dataId) => {
    $.ajax({
        type: "DELETE",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
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

  // var getNotes = (peopleId) => {
  //   fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People/" + peopleId + "?api_key=keyK2FU3DKzVm9DNS")
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         records.forEach((record) => {
  //           if (record.fields.peopleNotes.length) {
  //             record.fields.peopleNotes.forEach((noteId) => {
  //               var note = getNotes(noteId);
  //               debugger;
  //             })
  //           }
  //         })
  //         return result;
  //       },
  //       (error) => {
  //         return error;
  //       }
  //     )
  // }

  // var createRecord = () => {
  //
  // }
  //
  // var editRecord = () => {
  //
  // }
  //
  // var deletePerson = () => {
  //
  // }

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
    putRecord({fields: blah}, e.target.id);
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
    putNoteRecord({fields: blah}, e.target.id);
    setEditMode(null);
  };

  var deletePerson = (e) => {
    deletePersonRecord(e.target.id);
  };

  var deleteNote = (e) => {
    deleteNoteRecord(e.target.id);
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
    postPersonRecord({fields: blah});
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
    postPersonNoteRecord({fields: blah});
    // setEditMode(null);
  };

  var sort = (e) => {
    console.log(e);
    console.log("before:",people);
    // debugger;
    var blah = people.sort((a,b)=> (a[e.target.id] < b[e.target.id] ? 1 : -1));
    setPeople([...blah]);
    console.log("after:",people);
  };

  var hasFormErrors = (data) => {
    var requiredFields = ["name", "birthday", "zipCode"];
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
    setFormErrors({...formErrors, required: missingFields, format: wrongFormats});
  }

  // var getNotes = (e) => {
  //   var noteId = e.target.getAttribute('value');
  //   if (noteId) {
  //     fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes/"+noteId+"?api_key=keyK2FU3DKzVm9DNS")
  //       .then(res => res.json())
  //       .then(
  //         (result) => {
  //           people.forEach(person => {
  //             if (person.id === result.fields.peopleId[0]) {
  //               if (person.notes) {
  //                 person.notes.push(result);
  //               } else {
  //                 person.notes= [result];
  //               }
  //             }
  //           })
  //           setPeopleNotes(people);
  //         },
  //         (error) => {
  //           return error;
  //         }
  //       )
  //   }
  //
  // };

  return (
    <div className="Table">
    People
    <button className="bleh">just spit up random new entries lol</button>
    <table className="table">
      <thead>
        <tr>
          <th scope="col" id="name" onClick={sort}>
            Name
            <i className="bi bi-arrow-down-up"></i>
          </th>
          <th scope="col" id="birthday" onClick={sort}>
            Birthday
            <i className="bi bi-arrow-down-up"></i>
          </th>
          <th scope="col" id="zipCode" onClick={sort}>
            Zip Code
            <i className="bi bi-arrow-down-up"></i>
          </th>
          <th scope="col" id="createdTime" onClick={sort}>
            Created Time
            <i className="bi bi-arrow-down-up"></i>
          </th>
          <th scope="col" id="modifiedTime" onClick={sort}>
            Modified Time
            <i className="bi bi-arrow-down-up"></i>
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
              <td>
                {inEditMode && <input className="form-control" form={formId} type="text" name="zipCode" defaultValue={person.fields.zipCode}></input>}
                {!inEditMode && <span>{person.fields.zipCode}</span>}
              </td>
              <td>
                <Moment format="YYYY-MM-DD HH:mm">{person.fields.createdTime}</Moment>
              </td>
              <td>
                <Moment format="YYYY-MM-DD HH:mm">{person.fields.modifiedTime}</Moment>
              </td>
              <td style={{display: 'none'}}>
                <input className="form-control" form={formId} type="text" hidden name="peopleNotes" defaultValue={person.fields.peopleNotes}></input>
              </td>
              <td>
                {!!personNotes.length &&
                  <a id={person.id} onClick={toggleNotes} title="View Notes" className="bi bi-list-stars"></a>
                }
                {!personNotes.length &&
                  <a id={person.id} onClick={toggleNotes}>Add+</a>
                }
              </td>
              <td>
                {!inEditMode && <a id={person.id} onClick={changeEditMode} title="Edit" className="bi bi-pencil-fill"></a>}
                {inEditMode && <a type="submit" id={person.id} onClick={removeFromEditMode} title="Save" className="bi bi-save-fill"></a>}
              </td>
              <td>
                <a id={person.id} onClick={deletePerson} title="Delete" className="bi bi-trash-fill"></a>
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
                            <td>
                              <a id={note.id} onClick={deleteNote} title="Delete" className="bi bi-trash-fill"></a>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  }
                  <form key="new-note" id="new-note" className="row">
                    <input type="hidden" name="peopleId" value={person.id}></input>
                    <span className="col">New Note:</span>
                    <input className="col form-control" type="text" name="note" placeholder="Message"></input>
                    <a type="submit" onClick={createNewNote} title="Save" className="col bi bi-save-fill"></a>
                  </form>
                </td>
              </tr>
            }
            </tbody>
          )
        })}
        </table>

        <br/><br/><br/><br/>

        <form key="new-person" id="new-person" className="row">
          <input className="col form-control" type="text" name="name" placeholder="name"></input>
          <div style={{display:formErrors.required.includes("name") ? "block" : "none"}} className="invalid-feedback">Name is required.</div>
          <input className="col form-control" type="text" name="birthday" placeholder="birthday"></input>
          <div style={{display:formErrors.required.includes("birthday") ? "block" : "none"}} className="invalid-feedback">Birthday is required.</div>
          <input className="col form-control" type="text" name="zipCode" placeholder="zipCode"></input>
          <div style={{display:formErrors.required.includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code is required.</div>
          <div style={{display:formErrors.format.includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code must be a 5 digit number.</div>
          <a className="col save" type="submit" onClick={createNewPerson} title="Save" className="col bi bi-save-fill"></a>
        </form>
    </div>
  );
}

export default Table;
