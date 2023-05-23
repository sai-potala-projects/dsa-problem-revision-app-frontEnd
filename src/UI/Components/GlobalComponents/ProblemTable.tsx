import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  TextField,
  Button,
  Box,
  Checkbox,
  TableCellProps,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { JSX } from 'react/jsx-runtime';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useDispatch, useSelector } from 'react-redux';
import { problemServiceCall, problemServiceCallMessageReset } from '../../../Redux/Actions/problemActions';

const columns = [
  { id: 'problemTitle', label: 'Problem Title' },
  { id: 'problemStatement', label: 'Problem Statement' },
  { id: 'difficultyLevel', label: 'Difficulty Level' },
  { id: 'isCompleted', label: 'mark as completed' },
  { id: 'timesSolved', label: 'no of times solved' },
  { id: 'url', label: 'problem url' },
];

interface NewRow {
  problemTitle?: string;
  problemStatement?: string;
  difficultyLevel?: string;
  notes?: string;
  isCompleted?: string;
  timesSolved?: string;
  url?: string;
}

interface ProblemTableProps {
  tableData: any;
  tableDifficultyLevel: string;
}

const StyledTableCell = (props: JSX.IntrinsicAttributes & TableCellProps) => (
  <TableCell sx={{ padding: '8px' }} {...props} />
);

const ProblemTable = ({ tableData, tableDifficultyLevel }: ProblemTableProps) => {
  const ROWS_PER_PAGE = 5;
  const initialNewRow: NewRow = { difficultyLevel: tableDifficultyLevel };
  const dispatch = useDispatch();

  const problemListData = useSelector((state: any) => state.problemServiceData);
  const { saveLoading, saveError, saveSuccess } = problemListData;
  const [data, setData] = useState<any>(tableData);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [newRow, setNewRow] = useState<NewRow>(initialNewRow);
  const [page, setPage] = useState(0);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState<boolean>(false);
  const [saveConfirmationOpen, setSaveConfirmationOpen] = useState<boolean>(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackBarOnSavecolor = !!saveError ? 'failure' : 'success';
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  const startRow = page * ROWS_PER_PAGE;
  const endRow = startRow + ROWS_PER_PAGE;

  useEffect(() => {
    if (!saveError) {
      setPage(0); // Reset the page to 0 whenever tableData prop changes
      setSelectedRows([]);
      setData(tableData);
    }
  }, [tableData]);

  const handleRowClick = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { checked } = event.target;
    let updatedSelectedRows = [...selectedRows];

    if (checked) {
      updatedSelectedRows.push(index);
    } else {
      updatedSelectedRows = updatedSelectedRows.filter((row: number) => row !== index);
    }

    // Check if any selected rows are new records
    const hasNewRecordSelected = updatedSelectedRows.some((row) => !data[row]._id);

    setSelectedRows(updatedSelectedRows);
    setDeleteButtonDisabled(hasNewRecordSelected);
  };

  const handleExpandRow = (index: number) => {
    const newData = [...data];
    newData[index].expanded = !newData[index].expanded;
    setData(newData);
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleSaveConfirmation = () => {
    setSaveConfirmationOpen(true);
  };

  const handleDelete = () => {
    // Perform delete action
    const filteredData = data.filter((problem: any, index: number) => {
      if (selectedRows.includes(index)) {
        return true;
      }
    });

    const toBeDeletedData = filteredData.map((deleteProblem: any) => {
      return deleteProblem._id;
    });
    setDeleteConfirmationOpen(false);
    dispatch(problemServiceCall({ requestBody: { problemIds: toBeDeletedData }, url: '/problems/delete' }) as any);
  };

  const handleSave = async () => {
    // Perform save action
    const savedData = data.filter((problem: any, index: number) => {
      if (selectedRows.includes(index)) {
        return problem;
      }
    });
    setSaveConfirmationOpen(false);
    dispatch(problemServiceCall({ requestBody: { problems: savedData }, url: '/problems/add' }) as any);
  };

  const handleCancel = () => {
    setSaveConfirmationOpen(false);
    setDeleteConfirmationOpen(false);
  };
  const handleRowDoubleClick = (index: number) => {
    const newData = [...data];
    newData[index].expanded = true;
    setData(newData);
    setSelectedRows([index]);
  };

  const handleInputChange = (event: any, index: number, column: string) => {
    const { value } = event.target;
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
  };

  const handleTextFieldClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleSaveClick = () => {
    // Open save confirmation modal
    handleSaveConfirmation();
  };

  const handleAddRow = () => {
    const updatedData = [...data, newRow];
    const newRowIndex = updatedData.length - 1;
    const newPage = Math.floor(newRowIndex / ROWS_PER_PAGE);

    setData(updatedData);
    setNewRow({});
    setSelectedRows([...selectedRows, newRowIndex]); // Preselect the newly added row
    setPage(newPage);
    setDeleteButtonDisabled(true); // Disable delete button when a new row is added
  };

  const handleChangePage = (newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ width: '100%', maxHeight: '100h', overflow: 'auto' }}>
      {saveLoading ? ( // Render the loading circle when loading is true
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#FFE569' }}>
                <TableRow>
                  <StyledTableCell key="checkbox"></StyledTableCell>
                  {columns.map((column) => (
                    <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
                  ))}
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(startRow, endRow).map((row: any, index: number) => (
                  <React.Fragment key={startRow + index}>
                    <TableRow
                      sx={{ height: '30px', marginBottom: '5px' }}
                      hover
                      selected={selectedRows.includes(startRow + index)}
                      onDoubleClick={() => handleRowDoubleClick(startRow + index)}
                    >
                      <StyledTableCell key="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(startRow + index)}
                          onChange={(event) => handleRowClick(event, startRow + index)}
                        />
                      </StyledTableCell>
                      {columns.map((column: any) => (
                        <StyledTableCell key={column.id}>
                          {selectedRows.includes(startRow + index) ? (
                            column.id === 'difficultyLevel' ? (
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" size="small">
                                  Difficulty Level
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={row[column.id]}
                                  label="Difficulty Level"
                                  onChange={(event) => handleInputChange(event, startRow + index, column.id)}
                                  onClick={handleTextFieldClick}
                                >
                                  <MenuItem value={'Easy'}>Easy</MenuItem>
                                  <MenuItem value={'Medium'}>Medium</MenuItem>
                                  <MenuItem value={'Hard'}>Hard</MenuItem>
                                </Select>
                              </FormControl>
                            ) : column.id === 'isCompleted' ? (
                              <FormControl fullWidth>
                                <InputLabel id="mark as completed" size="small">
                                  Mark as completed
                                </InputLabel>
                                <Select
                                  labelId="mark as completed"
                                  id="mark as completed"
                                  value={row[column.id]}
                                  label="Mark as completed"
                                  onChange={(event) => handleInputChange(event, startRow + index, column.id)}
                                  onClick={handleTextFieldClick}
                                >
                                  <MenuItem value={'true'}>true</MenuItem>
                                  <MenuItem value={'false'}>false</MenuItem>
                                </Select>
                              </FormControl>
                            ) : (
                              <TextField
                                value={row[column.id]}
                                onChange={(event) => handleInputChange(event, startRow + index, column.id)}
                                onClick={handleTextFieldClick}
                                variant="outlined"
                                size="small"
                              />
                            )
                          ) : column.id === 'url' ? (
                            <a href={row[column.id]} target="_blank" rel="noopener noreferrer">
                              {row[column.id]}
                            </a>
                          ) : (
                            row[column.id]
                          )}
                        </StyledTableCell>
                      ))}
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleExpandRow(startRow + index)}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                    {row.expanded && (
                      <TableRow>
                        <StyledTableCell colSpan={columns.length + 2}>
                          {/* Content for expanded row */}
                          <TextField
                            label="Notes"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            value={row.notes || ''}
                            onChange={(event) => handleInputChange(event, startRow + index, 'notes')}
                            onClick={handleTextFieldClick}
                          />
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
            <IconButton
              disabled={page === 0}
              onClick={() => handleChangePage(page - 1)}
              style={{ marginRight: '10px' }}
              aria-label="Previous"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <div>
              Showing {startRow + 1} - {Math.min(endRow, totalRows)} of {totalRows} records
            </div>
            <IconButton
              disabled={page === totalPages - 1}
              onClick={() => handleChangePage(page + 1)}
              style={{ marginLeft: '10px' }}
              aria-label="Next"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Typography sx={{ marginTop: '5px' }}>Add New Record</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Problem Title"
                  variant="outlined"
                  size="small"
                  required // Add required prop
                  error={!newRow.problemTitle} // Add error style if value is empty
                  value={newRow['problemTitle'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, problemTitle: event.target.value })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Problem Statement"
                  variant="outlined"
                  size="small"
                  value={newRow['problemStatement'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, problemStatement: event.target.value })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" size="small">
                    Difficulty Level
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newRow['difficultyLevel'] || ''}
                    label="Difficulty Level"
                    onChange={(event) => {
                      console.log('event.target.value :', event.target.value);
                      setNewRow({ ...newRow, difficultyLevel: event.target.value });
                    }}
                  >
                    <MenuItem value={'Easy'}>Easy</MenuItem>
                    <MenuItem value={'Medium'}>Medium</MenuItem>
                    <MenuItem value={'Hard'}>Hard</MenuItem>
                  </Select>
                </FormControl>
                {/* <TextField
                  label="Difficulty Level"
                  variant="outlined"
                  label="Difficulty Level"
                  size="small"
                  value={newRow['difficultyLevel'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, difficultyLevel: event.target.value })}
                /> */}
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="mark as completed" size="small">
                    mark as completed
                  </InputLabel>
                  <Select
                    labelId="mark as completed"
                    id="mark as completed"
                    value={newRow['isCompleted'] || ''}
                    label="Mark as completed"
                    onChange={(event) => {
                      console.log('event.target.value :', event.target.value);
                      setNewRow({ ...newRow, isCompleted: event.target.value });
                    }}
                  >
                    <MenuItem value={'true'}>true</MenuItem>
                    <MenuItem value={'false'}>false</MenuItem>
                  </Select>
                </FormControl>
                {/* <TextField
                  label="mark as completed"
                  variant="outlined"
                  size="small"
                  value={newRow['isCompleted'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, isCompleted: event.target.value })}
                /> */}
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="no of times solved"
                  variant="outlined"
                  size="small"
                  value={newRow['timesSolved'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, timesSolved: event.target.value })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="problem url"
                  variant="outlined"
                  size="small"
                  value={newRow['url'] || ''}
                  onChange={(event) => setNewRow({ ...newRow, url: event.target.value })}
                />
              </Box>
              <Box sx={{ marginLeft: '10px' }}>
                <Button
                  variant="contained"
                  disabled={!Boolean(newRow['problemTitle'])}
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
              disabled={selectedRows.length === 0}
              sx={{ marginRight: '10px' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteConfirmation}
              disabled={selectedRows.length === 0 || deleteButtonDisabled}
            >
              Delete
            </Button>
          </Box>
          {/* Save Confirmation Modal */}
          <Dialog
            open={saveConfirmationOpen}
            onClose={handleCancel}
            sx={{
              border: '2px solid green',
              borderRadius: '8px', // Optional for rounded corners
            }}
          >
            <Box
              sx={{
                border: '2px solid green',
              }}
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to save the selected rows?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          {/* Delete Confirmation Modal */}
          <Dialog open={deleteConfirmationOpen} onClose={handleCancel}>
            <Box
              sx={{
                border: '2px solid red',
              }}
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete the selected rows?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleDelete} variant="contained" color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          {/* Snackbar */}
          <ClickAwayListener
            onClickAway={() => {
              setSnackbarOpen(false);
              dispatch(problemServiceCallMessageReset() as any);
            }}
          >
            <Snackbar
              open={snackbarOpen || !!saveError || !!saveSuccess}
              autoHideDuration={5}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Box
                sx={{
                  backgroundColor: snackBarOnSavecolor === 'success' ? 'green' : 'red',
                  color: 'white',
                  minWidth: '200px',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                {saveError || saveSuccess}
              </Box>
            </Snackbar>
          </ClickAwayListener>
        </Box>
      )}
    </div>
  );
};

export default ProblemTable;
