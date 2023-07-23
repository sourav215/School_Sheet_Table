import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Input, Button } from "@mui/joy";
import UpdateIcon from "@mui/icons-material/Update";
import Add from "@mui/icons-material/Add";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const END_POINT_URL = 'https://sheetdb.io/api/v1/do3jx5vi2c0ov'

const Home = () => {
  const [tableData, setTableData] = useState([]);
  const readSheetData = async () => {
    try {
      const res = await fetch(END_POINT_URL);
      const data = await res.json();
      setTableData(data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const createGoogleSheetRow = async (payload) => {
    try {
      await fetch(END_POINT_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      toast.success("New Row Created", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });

    } catch (err) {
      console.log("Error:", err);
    }
  };

  const updateGoogleSheet = async (Sl, payload) => {
    try {
      await fetch(
        `${END_POINT_URL}/Sl/${Sl}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleSyllabusChange = async (item, newsyllabus) => {
    try {
      let res = await updateGoogleSheet(item.Sl, { syllabus: newsyllabus });
      console.log("Updated:", res);
      toast.success("Syllabus is Updated", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });
      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }

  };
  const handleActiveProductsChange = async (item, newActiveProduct) => {
    try {
      await updateGoogleSheet(item.Sl, {
        activeProducts: newActiveProduct,
      });
      toast.success("activeProducts is Updated", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });
      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }

    
  };
  const handleActiveSubjectsChange = async (item, newActiveSubject) => {
    try {
      await updateGoogleSheet(item.Sl, {
        activeSubjects: newActiveSubject,
      });
      toast.success("activeSubjects is Updated", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });
      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateGoogleSheet(item.Sl, {
        Status: newStatus,
      });
      toast.success("Status is Updated", {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });
      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleTextInputChange = (key, value, item) => {
    setTableData(
      tableData.map((ele) => {
        if (ele.Sl === item.Sl && ele.name === item.name) {
          ele[key] = value;
        }
        return ele;
      })
    );
  };

  const handleTextInputClick = async (key, item) => {
    let obj = tableData.find((ele) => {
      return ele.Sl === item.Sl;
    });
    if (!obj) return;
    try {
      await updateGoogleSheet(item.Sl, { [key]: obj[key] });
      toast.success(`${key} is Updated`, {
        position: "top-center",
        theme: "colored",
        autoClose: 1000,
        hideProgressBar: true,
      });
      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }
  };
  const findNextSl = () => {
    let maxSl = 1;
    tableData.forEach((ele) => {
      maxSl = Math.max(maxSl, ele.Sl);
    });
    return maxSl + 1;
  };
  const addNewCell = async () => {
    let nextSl = findNextSl();
    try {
      await createGoogleSheetRow({
        Sl: nextSl,
        name: "",
        syllabus: "icse",
        activeProducts: "RLV",
        activeSubjects: "Science",
        activeClasses: "",
        activeChapters: "",
        "test username": "",
        "test user password": "",
        Status: "active",
      });

      await readSheetData();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    readSheetData();
  }, []);
  return (
    <div>
      <h1>All School Data</h1>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px", padding: "20px" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sl</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Syllabus</TableCell>
              <TableCell align="right">ActiveProducts</TableCell>
              <TableCell align="right">ActiveSubjects</TableCell>
              <TableCell align="right">ActiveClasses</TableCell>
              <TableCell align="right">ActiveChapters</TableCell>
              <TableCell align="right">Test Username</TableCell>
              <TableCell align="right">Test User Password</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((elem, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {elem.Sl}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {/* {elem.name} */}
                    <Input
                      value={elem.name}
                      sx={{ width: "200px" }}
                      onChange={(e) => {
                        handleTextInputChange("name", e.target.value, elem);
                      }}
                      endDecorator={
                        <Button
                          color="neutral"
                          onClick={() => {
                            handleTextInputClick("name", elem);
                          }}
                        >
                          <UpdateIcon />
                        </Button>
                      }
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        syllabus
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={elem.syllabus}
                        label="syllabus"
                        onChange={(e) => {
                          handleSyllabusChange(elem, e.target.value);
                        }}
                      >
                        <MenuItem value={"cbse"}>cbse</MenuItem>
                        <MenuItem value={"msbs"}>msbs</MenuItem>
                        <MenuItem value={"icse"}>icse</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        activeProducts
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={elem.activeProducts}
                        label="activeProducts"
                        onChange={(e) => {
                          handleActiveProductsChange(elem, e.target.value);
                        }}
                      >
                        <MenuItem value={"RLV"}>RLV</MenuItem>
                        <MenuItem value={"BQGLV"}>BQGLV</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        activeSubjects
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={elem.activeSubjects}
                        label="activeProducts"
                        onChange={(e) => {
                          handleActiveSubjectsChange(elem, e.target.value);
                        }}
                      >
                        <MenuItem value={"Science"}>Science</MenuItem>
                        <MenuItem value={"Maths"}>Maths</MenuItem>
                        <MenuItem value={"Science,Maths"}>
                          Science,Maths
                        </MenuItem>
                        <MenuItem value={"Science,Maths,Geography"}>
                          Science,Maths,Geography
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Input
                      value={elem["activeClasses"]}
                      sx={{ width: "200px" }}
                      onChange={(e) => {
                        handleTextInputChange(
                          "activeClasses",
                          e.target.value,
                          elem
                        );
                      }}
                      endDecorator={
                        <Button
                          color="neutral"
                          onClick={() => {
                            handleTextInputClick("activeClasses", elem);
                          }}
                        >
                          <UpdateIcon />
                        </Button>
                      }
                    />
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Input
                      value={elem["activeChapters"]}
                      sx={{ width: "200px" }}
                      onChange={(e) => {
                        handleTextInputChange(
                          "activeChapters",
                          e.target.value,
                          elem
                        );
                      }}
                      endDecorator={
                        <Button
                          color="neutral"
                          onClick={() => {
                            handleTextInputClick("activeChapters", elem);
                          }}
                        >
                          <UpdateIcon />
                        </Button>
                      }
                    />
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Input
                      value={elem["test username"]}
                      sx={{ width: "200px" }}
                      onChange={(e) => {
                        handleTextInputChange(
                          "test username",
                          e.target.value,
                          elem
                        );
                      }}
                      endDecorator={
                        <Button
                          color="neutral"
                          onClick={() => {
                            handleTextInputClick("test username", elem);
                          }}
                        >
                          <UpdateIcon />
                        </Button>
                      }
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Input
                      value={elem["test user password"]}
                      sx={{ width: "200px" }}
                      onChange={(e) => {
                        handleTextInputChange(
                          "test user password",
                          e.target.value,
                          elem
                        );
                      }}
                      endDecorator={
                        <Button
                          color="neutral"
                          onClick={() => {
                            handleTextInputClick("test user password", elem);
                          }}
                        >
                          <UpdateIcon />
                        </Button>
                      }
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={elem.Status}
                        label="Status"
                        onChange={(e) => {
                          handleStatusChange(elem, e.target.value);
                        }}
                      >
                        <MenuItem value={"active"}>active</MenuItem>
                        <MenuItem value={"inactive"}>inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: "flex", alignItems: "left", marginLeft: "20px"}}>
        <Button startDecorator={<Add />} onClick={addNewCell}>
          Add New Row
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
