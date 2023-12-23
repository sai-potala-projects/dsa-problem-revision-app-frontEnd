import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField, // Import CircularProgress component
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProblemTable from '../Components/GlobalComponents/ProblemTable';
import { useDispatch, useSelector } from 'react-redux';
import { problemServiceCall, userCollections } from '../../Redux/Actions/problemActions';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Auth_Reset } from '../../Redux/Constants/signInConstants';

const LandingPage = () => {
  const history = useHistory();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const {
    problemServiceData,
    userDetails: { userInfo },
  } = useSelector((state: any) => state);
  const { loading, error, problemData, collections } = problemServiceData;
  const [userCollectionData, setUserCollectionsData] = useState<String[]>(collections || []);
  const [currentCollectionName, setCurrentCollectionName] = useState(collections?.[0] || '');

  const [newCollectionName, setNewCollectionName] = useState<String>('');
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo || error === 'Invalid Token') {
      Cookies.remove('userInfo');
      dispatch({
        type: Auth_Reset,
      });
      setShowModal(true);
      setTimeout(() => {
        history.push('/');
      }, 2000);
    }

    dispatch(userCollections({ requestBody: {}, url: '/problems/collections/get' }) as any);
  }, [userInfo, error]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  const handleAddCollection = () => {
    setModalOpen(true);
  };

  const handleSaveCollection = () => {
    setUserCollectionsData((prev: String[]) => {
      prev.unshift(newCollectionName);
      return prev;
    });
    setCurrentCollectionName(newCollectionName);

    // dispatch(
    //   problemServiceCall({
    //     requestBody: { collectionName: newCollectionName },
    //     url: '/problems/get',
    //     isGetServiceCall: true,
    //   }) as any
    // );
    setModalOpen(false);
  };

  useEffect(() => {
    if (!currentCollectionName) {
      setCurrentCollectionName(collections?.[0]);
    }
    setUserCollectionsData(collections);
  }, [collections]);
  return (
    <Box sx={{ backgroundColor: 'F9FBE7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'FEA1A1' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hi {userInfo?.userName || ''}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {`Collection Name : ${currentCollectionName}`}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} sx={{ width: '30vw' }} onClose={() => setDrawerOpen(false)}>
        <List>
          {userCollectionData?.length > 0 &&
            userCollectionData.map((collection: String) => (
              <ListItem
                button
                onClick={() => {
                  setCurrentCollectionName(collection);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={collection} />
              </ListItem>
            ))}
          <Divider />
        </List>

        <List>
          <ListItem button onClick={handleAddCollection}>
            <ListItemText primary="Add Collection" />
          </ListItem>
        </List>
      </Drawer>

      <Dialog
        open={isModalOpen}
        PaperProps={{
          style: {
            width: '400px',
            height: '250px',
          },
        }}
      >
        <DialogTitle>Add New Collection</DialogTitle>
        <DialogContent sx={{ marginTop: '10px' }}>
          <TextField
            label="Collection Name"
            variant="outlined"
            fullWidth
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveCollection} disabled={!newCollectionName.trim()} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ margin: '20px' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: '20px' }}>
          <Tab label="Easy Level Problems" />
          <Tab label="Medium Level Problems" />
          <Tab label="Difficult Level Problems" />
        </Tabs>
        {loading ? ( // Render the loading circle when loading is true
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error ? (
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'red' }}>
                {error && `${error}`}
              </Typography>
            ) : (
              <>
                {activeTab === 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <ProblemTable
                      tableData={problemData.filter(
                        (problem: any) =>
                          problem.difficultyLevel === 'Easy' && problem.collectionName === currentCollectionName
                      )}
                      tableDifficultyLevel="Easy"
                      collectionName={currentCollectionName}
                    />
                  </Box>
                )}
                {activeTab === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <ProblemTable
                      tableData={problemData.filter(
                        (problem: any) =>
                          problem.difficultyLevel === 'Medium' && problem.collectionName === currentCollectionName
                      )}
                      tableDifficultyLevel="Medium"
                      collectionName={currentCollectionName}
                    />
                  </Box>
                )}
                {activeTab === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <ProblemTable
                      tableData={problemData.filter(
                        (problem: any) =>
                          problem.difficultyLevel === 'Hard' && problem.collectionName === currentCollectionName
                      )}
                      tableDifficultyLevel="Hard"
                      collectionName={currentCollectionName}
                    />
                  </Box>
                )}
                <Dialog
                  open={showModal}
                  onClose={(event: any, reason: any) => {
                    if (reason && reason === 'backdropClick') {
                      return;
                    }
                    setShowModal(false);
                  }}
                  disableEscapeKeyDown
                >
                  <Box>
                    <DialogTitle>
                      <Typography>Session Expired</Typography>
                    </DialogTitle>
                    <DialogContent>
                      <Typography>Redirecting to login page...</Typography>
                    </DialogContent>
                  </Box>
                </Dialog>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
