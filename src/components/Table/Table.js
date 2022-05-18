const React = require('react'),
      $ = require('jquery'),
      { useState, useEffect } = require('react');
// import './Table.css';

function Table() {
  const [people, setPeople] = useState([]);
  const [peopleNotes, setPeopleNotes] = useState([]);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    refreshPeopleData();
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
          setPeopleNotes(notesObj);
        },
        (error) => {
          return error;
        }
      )
  }

  var putRecord = (data, dataId) => {
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
    $.ajax({
        type: "PUT",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
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

  var removeFromEditMode = (e) => {
    console.log(e);
    e.preventDefault();
    var blah = {};
    $("#form_"+e.target.id).serializeArray().forEach(item => {
      if (item.value) {
        console.log(people);
        debugger;
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
        {Object.entries(people).map(([personId, person]) => {
          console.log('editMode:',editMode);
          var inEditMode = editMode === person.id;
          var formId = "form_"+person.id;
          var personNotes = [];
          if ((person.fields.peopleNotes || []).length) {
            person.fields.peopleNotes.forEach(noteId => {
              personNotes.push(peopleNotes[noteId]);
            });

          }
          return (
            <span>
            <form key={personId} id={formId}>
              {inEditMode && <input type="text" name="name" defaultValue={person.fields.name}></input>}
              {!inEditMode && <span>{person.fields.name}</span>}
              {inEditMode && <input type="text" name="birthday" defaultValue={person.fields.birthday}></input>}
              {!inEditMode && <span>{person.fields.birthday}</span>}
              {inEditMode && <input type="text" name="zipCode" defaultValue={person.fields.zipCode}></input>}
              {!inEditMode && <span>{person.fields.zipCode}</span>}
              <span>{person.fields.createdTime}</span>
              <span>{person.fields.modifiedTime}</span>
              <input type="text" hidden name="peopleNotes" defaultValue={person.fields.peopleNotes}></input>
              <a className="edit" id={person.id}>Notes</a>
              {!inEditMode && <a className="edit" id={person.id} onClick={changeEditMode}>Edit</a>}
              {inEditMode && <a className="save" type="submit" id={person.id} onClick={removeFromEditMode}>Save</a>}
              <a className="delete" id={person.id} onClick={deletePerson}>Delete</a>
            </form>
            {personNotes.length && personNotes.map(note => {
              var inNoteEditMode = editMode === note.id;
              var noteFormId = "form_"+note.id;
              return(
                <form key={note.id} id={noteFormId}>
                  <span>{note.fields.noteId}</span>
                  {inNoteEditMode && <input type="text" name="note" defaultValue={note.fields.note}></input>}
                  {!inNoteEditMode && <span>{note.fields.note}</span>}
                  {!inNoteEditMode && <a className="edit" id={note.id} onClick={changeEditMode}>Edit</a>}
                  {inNoteEditMode && <a className="save" type="submit" id={note.id} onClick={removeFromNoteEditMode}>Save</a>}
                  <a className="delete" id={note.id} onClick={deleteNote}>Delete</a>
                </form>
              )
            })}
            </span>
          )
        })}
    </div>
  );
}

export default Table;
