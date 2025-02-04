import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';

import axios from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { IconButton, Paper, Menu, MenuItem, Snackbar, SnackbarCloseReason, Badge, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';


// ----------------------------------------------------------------------

export function UserView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [userLogDetails, setUserLogDetails] = useState<any>(null);
  const [userLogErrorDetails, setUserLogErrorDetails] = useState<any>(null);
  const [userActivityDetails, setUserActivityDetails] = useState<any>(null);
  const [userActivityErrorDetails, setUserActivityErrorDetails] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('accessToken');


  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:8000/api/admin/view-users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsersData(response.data);
    console.log('Users Data:', response.data);
  };

  useEffect(() => {
    if (!token) {
      // Redirect to sign-in page
      router.push('/');
    } else {
      // Fetch users data
      fetchUsers();
    }
  }, []);

  // const dataFiltered: UserProps[] = applyFilter({
  //   inputData: usersData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filterName,
  // });

  // const notFound = !dataFiltered.length && !!filterName;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogDetails = () => {
    const { id } = selectedRow;
    const fetchUserLogDetials = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/user-log-details/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserLogDetails(response.data.logs);
        console.log('User Logs Data:', response.data.logs);
      } catch (error: any) {
        console.error('User log details fetch failed:', error.response?.data.error || error.message);
        setUserLogErrorDetails(error.response?.data.error);
        setOpen(true);
      }
    };

    fetchUserLogDetials();
    setAnchorEl(null);
  }

  const handleUserActivity = () => {
    const { id } = selectedRow;
    const fetchUserActivityDetials = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/user-activity-details/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserActivityDetails(response.data.activities);
        console.log('User Activity Data:', response.data.activities);
      } catch (error: any) {
        console.error('User Activity details fetch failed:', error.response?.data.error || error.message);
        setUserActivityErrorDetails(error.response?.data.error);
        setOpen(true);
      }
    };

    fetchUserActivityDetials();
    setAnchorEl(null);
  }

  const handleStatusChange = (value: any, row: any) => {
    try {
      const { id } = row;
      const response = axios.put(`http://localhost:8000/api/admin/toggle-user-status/${id}/`, {
        status: value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User status changed:', response.data.message);
    } catch (error: any) {
      console.error('User status change failed:', error.response?.data.error || error.message);
      
    }
  }

  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First name', width: 200 },
    { field: 'last_name', headerName: 'Last name', width: 200 },
    {
      field: 'email',
      headerName: 'Email',
      width: 300
    },
    {
      field: 'utype',
      headerName: 'User Type',
      renderCell: (params) => {
        if (params.value === "2") {
          return "Learner";
        };
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
        if (params.value) {
          return (
            <Chip label="Active" onClick={handleStatusChange(params.value, params.row)} />
          );
        } else {
          return (
            <Chip label="Inctive" onClick={handleStatusChange(params.value, params.row)} />
          );
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={(e) => handleMenuClick(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const rows = [
    { id: 1, last_name: 'Snow', first_name: 'Jon', utype: 35, status: 'Active' },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 67 },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        {/* <CloseIcon fontSize="small" /> */}
        x
      </IconButton>
      </>
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={userLogErrorDetails}
        action={action}
      />

      <Card>
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={usersData?.users}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleLogDetails}>Log Details</MenuItem>
          <MenuItem onClick={handleUserActivity}>Activities</MenuItem>
        </Menu>
        {/* <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        /> */}

        {/* <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={usersData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    usersData.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'utype', label: 'Type' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                
                    <UserTableRow
                      key={"row.id"}
                      row={{row: ""}}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, usersData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar> */}

        {/* <TablePagination
          component="div"
          page={table.page}
          count={usersData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        /> */}
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
