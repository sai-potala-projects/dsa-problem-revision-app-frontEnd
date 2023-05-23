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
  DialogTitle, // Import CircularProgress component
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProblemTable from '../Components/GlobalComponents/ProblemTable';
import { useDispatch, useSelector } from 'react-redux';
import { problemServiceCall } from '../../Redux/Actions/problemActions';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Auth_Reset } from '../../Redux/Constants/signInConstants';

const LandingPage = () => {
  const history = useHistory();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const {
    problemServiceData,
    userDetails: { userInfo },
  } = useSelector((state: any) => state);
  const { loading, error, problemData } = problemServiceData;

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
    dispatch(problemServiceCall({ requestBody: {}, url: '/problems/get', isGetServiceCall: true }) as any);
  }, [userInfo, error]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: 'F9FBE7', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: 'FEA1A1' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hi {userInfo?.userName || ''},
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <List>
          <ListItem button onClick={handleDrawerClose}>
            <ListItemText primary="See Entire DSA Problem List" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

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
                    <Typography variant="h6" component="div" sx={{ marginBottom: '10px', color: '#ED2B2A' }}>
                      Easy Level Problems
                    </Typography>
                    <ProblemTable
                      tableData={problemData.filter((problem: any) => problem.difficultyLevel === 'Easy')}
                      tableDifficultyLevel="Easy"
                    />
                  </Box>
                )}
                {activeTab === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <Typography variant="h6" component="div" sx={{ marginBottom: '10px', color: '#F15A59' }}>
                      Medium Level Problems
                    </Typography>
                    <ProblemTable
                      tableData={problemData.filter((problem: any) => problem.difficultyLevel === 'Medium')}
                      tableDifficultyLevel="Medium"
                    />
                  </Box>
                )}
                {activeTab === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <Typography variant="h6" component="div" sx={{ marginBottom: '10px', color: '#F15A59' }}>
                      Difficult Level Problems
                    </Typography>
                    <ProblemTable
                      tableData={problemData.filter((problem: any) => problem.difficultyLevel === 'Hard')}
                      tableDifficultyLevel="Hard"
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
