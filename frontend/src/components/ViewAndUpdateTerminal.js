import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../App";
import { TerminalContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getdetails } from "../api/getbankdetails";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBAccordion, 
  MDBAccordionItem,
  MDBTable,
  MDBTableHead,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from "mdb-react-ui-kit";
import { updatevariable } from "../api/updateVariables";

function ViewAndUpdateTerminal() {
  const contextterminal = useContext(TerminalContext);
  //console.log("the context is: ", contextterminal[0]);
  const contextuser = useContext(UserContext);
  let navigate = useNavigate();

  const [bankdetails, setbankdetails] = useState(null);
  const [variable, setvariable] = useState({
    var_name: "",
    max_size: "",
    min_size: "",
    value: "",
  });

  const [parameter, setParameter] = useState("");
  const [parameters, setParameters] = useState(null);

  useEffect(() => {
    getdetails(contextuser[0]?.BankName).then((data) => {
      setbankdetails(data.details);
      setParameters(data.details.parameters);
      console.log(data);
    });
  }, [contextuser]);
  // Submit the updated variable
  const updatethevariable = () => {
    console.log("The param is : ", parameter);
    console.log("The vari is : ", variable);
    updatevariable(
      contextuser[0].BankName,
      parameter.par_name,
      variable,
      contextuser[0].email
    ).then((data) => {
      setbankdetails(data.details);
      setBasicModal(false);
      setParameter(null);
      setvariable({
        var_name: "",
        max_size: "",
        min_size: "",
        value: "",
      });
    });
  };

  //Parameters tab

  const [basicActive, setBasicActive] = useState(`${contextterminal[0]?.tparameters[0]?.par_name}`);

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };


  // POpUp variables
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = (param, vari) => {
    setBasicModal(!basicModal);
    setParameter(param);
    setvariable(vari);
  };
  return (
    <div className="view-terminal-container">

        {/* <h1 className="text-center title-padding">Hello user, you can now edit the variables of {contextuser[0]?.BankName}</h1>
        {bankdetails?.parameters.map((param) => {
          return (
            <>
            <MDBAccordion initialActive={0} className="my-3">
              <MDBAccordionItem collapseId={1} headerTitle={param?.par_name}>
                {param.variables.map((vari) => {
                  // setvariable(vari);
                  return (
                    <div className="mx-auto set-width" >
                      <span>{vari.var_name} : </span>
                      <input value={vari.value} readOnly  />
                      <MDBBtn className="btn-gap"
                        onClick={() => {
                          toggleShow(param, vari);
                        }} 
                      >
                        Update
                      </MDBBtn>
                      <br />
                      <br />
                    </div>
                  );
                })}
                <br />
                <br />
              </MDBAccordionItem>
            </MDBAccordion>
            </>
          );
        })} */}

        <>
          <MDBTabs className='mb-3 param-tabs'>
            {contextterminal[0]?.tparameters.map((tparam) => {
              return (
                <>
                  <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleBasicClick(`${tparam.par_name}`)} active={basicActive === `${tparam.par_name}`}>
                      {tparam.par_name}
                    </MDBTabsLink>
                  </MDBTabsItem>
                </>
              );
            })}
          </MDBTabs>
          {contextterminal[0]?.tparameters.map((tparam) => {
              return (
                <>
                  <MDBTabsContent>
                    <MDBTabsPane show={basicActive === `${tparam.par_name}`}>
                      <MDBTable>
                        <MDBTableHead>
                          <tr className="text-center">
                            {tparam.variables?.map((vari) => {
                              return (
                                  <th scope="col">{vari.var_name}</th>
                              );
                            })}
                          </tr>
                        </MDBTableHead>
                      </MDBTable>
                    </MDBTabsPane>
                  </MDBTabsContent>
                </>
              );
            })}
        </>

        

        {/* PopUp for editing */}
        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Modal title</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setBasicModal(false)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                {variable.var_name} :{" "}
                <input
                  value={variable.value}
                  onChange={(e) =>
                    setvariable({ ...variable, value: e.target.value })
                  }
                />
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={() => setBasicModal(false)}>
                  Close
                </MDBBtn>
                <MDBBtn
                  onClick={() => {
                    updatethevariable();
                  }}
                >
                  Save changes
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
    </div>
  );
}

export default ViewAndUpdateTerminal;