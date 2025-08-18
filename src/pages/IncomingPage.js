import {
    Box,
    Button,
    Fade,
    IconButton,
    Modal,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/config";
import { AuthContext } from "../context/AuthContext";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    borderRadius: 2
};

const IncomingPage = () => {
    const [inboundData, setInboundData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        item_code: '',
        item_name: '',
        qty: '',
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [role, setRole] = useState('staff');

    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        handleGetProfile();
        handleGetData();
    }, []);

    const handleGetProfile = async () => {
        try {
            const url = `${BASE_URL}/auth/profile`;
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.get(url, config);
            console.log("response", response.data);

            if (response.data) {
                const dataRole = response.data.data.role;
                setRole(dataRole);
            }
        } catch (error) {
            console.log("Failed get profile", error)
        }
    }

    const handleGetData = async () => {
        try {
            const url = `${BASE_URL}/inbound`;
            const response = await axios.get(url);
            if (response.data) {
                setInboundData(response.data.data)
            }
        } catch (error) {
            console.log("Failed get data", error);
        }
    }

    const handleSubmitData = async (e) => {
        e.preventDefault();

        try {
            const body = {
                item_code: formData.item_code,
                item_name: formData.item_name,
                qty: formData.qty
            }

            const url = `${BASE_URL}/inbound`;
            const response = await axios.post(url, body);
            if (response.data) {
                await handleGetData();
            }

            handleClose();
            setFormData({ id: null, item_code: '', item_ame: '', qty: '' });
        } catch (error) {
            console.log("Failed submit data", error);
        }
    }

    const handleUpdateData = async (e) => {
        e.preventDefault();
        try {
            const body = {
                item_code: formData.item_code,
                item_name: formData.item_name,
                qty: formData.qty
            }

            const url = `${BASE_URL}/inbound/${formData.id}`;
            const response = await axios.put(url, body);
            if (response.data) {
                await handleGetData();
            }

            handleClose();
            setFormData({ id: null, item_code: '', item_name: '', qty: '' });
        } catch (error) {
            console.log("Failed Update Data", error);
        }
    }

    const handleDeleteData = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            try {
                const url = `${BASE_URL}/inbound/${id}`;
                const response = await axios.delete(url);
                if (response.data) {
                    await handleGetData();
                }

            } catch (error) {
                console.log("Failed deleted item");
            }
        }
    }

    const handleOpen = () => {
        setFormData({ id: null, item_code: '', item_name: '', qty: '' });
        setOpenModal(true);
    };
    const handleEdit = (item) => {
        setFormData(item);
        setOpenModalEdit(true);
    };
    const handleClose = () => {
        setOpenModal(false);
        setOpenModalEdit(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) {
            return inboundData;
        }

        return inboundData.filter((item) => (item.item_code.toLowerCase().includes(searchQuery.toLowerCase())
            || item.item_name.toLowerCase().includes(searchQuery.toLowerCase())))
    }, [inboundData, searchQuery])

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Barang Masuk
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                    Tambah Barang Masuk
                </Button>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>
            <Paper elevation={0}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Tanggal</TableCell>
                                <TableCell>Kode Barang</TableCell>
                                <TableCell>Nama Barang</TableCell>
                                <TableCell>Jumlah</TableCell>
                                {role === 'admin' && (
                                    <TableCell align="center">Aksi</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.slice().reverse().map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.created_at}</TableCell>
                                        <TableCell>{row.item_code}</TableCell>
                                        <TableCell>{row.item_name}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        {role === 'admin' && (
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary" size="small"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteData(row.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Box sx={{ p: 4 }}>
                                            <InfoIcon color="action" sx={{ fontSize: 50, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Tidak ada data barang masuk.
                                            </Typography>
                                            {searchQuery && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Coba kata kunci lain atau tambah barang baru.
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Modal Tambah Barang masuk */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={openModal}>
                    <Box sx={style} component="form" onSubmit={handleSubmitData}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Tambah Barang Masuk
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                required
                                fullWidth
                                label="Kode Barang"
                                name="item_code"
                                value={formData.item_code.toUpperCase()}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Nama Barang"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Jumlah"
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                type="submit"
                            >
                                Simpan
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleClose}>
                                Batal
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Modal Edit barang masuk */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModalEdit}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={openModalEdit}>
                    <Box sx={style} component="form" onSubmit={handleUpdateData}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Edit Barang Masuk
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                required
                                fullWidth
                                label="Kode Barang"
                                name="item_code"
                                value={formData.item_code.toUpperCase()}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Nama Barang"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Jumlah"
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                type="submit"
                            >
                                Simpan
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleClose}>
                                Batal
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}

export default IncomingPage;