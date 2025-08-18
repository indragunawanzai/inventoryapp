import {
    Backdrop,
    Box,
    Button,
    Container,
    Fade,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
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
} from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { PageTitle } from "../components/common/PageTitle";
import React, { useMemo, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../config/config";

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

const OutgoingPage = () => {
    const [outboundData, setOutboundData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        item_code: '',
        qty: '',
        recipient_name: '',
        recipient_address: '',
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [availableItems, setAvailableItems] = useState([]);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        handleGetOutboundData();
        return () => { }
    }, [])

    const handleGetAvailableItem = async () => {
        try {
            const url = `${BASE_URL}/outbound/available/items`;
            const response = await axios.get(url);
            if (response.data) {
                setAvailableItems(response.data.data);
                handleOpen();
            }
        } catch (error) {
            console.log("Failed get available item", error);
        }
    }

    const handleGetOutboundData = async () => {
        try {
            const url = `${BASE_URL}/outbound`;
            const response = await axios.get(url);
            if (response.data) {
                setOutboundData(response.data.data)
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
                recipient_name: formData.recipient_name,
                recipient_address: formData.recipient_address,
                qty: formData.qty
            }

            const url = `${BASE_URL}/outbound`;
            const response = await axios.post(url, body);
            if (response.data) {
                await handleGetOutboundData();
            }

            handleClose();
            setFormData({
                id: null,
                item_code: '',
                qty: '',
                recipient_name: '',
                recipient_address: '',
            });
        } catch (error) {
            console.log("Failed submit data", error);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDownload = (rowData) => {
        console.log("download faktur");

        // const dataString = JSON.stringify(rowData, null, 2);
        // const blob = new Blob([dataString], { type: 'application/json' });
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = `Barang_Keluar_${rowData.namaBarang}.json`;
        // link.click();
        // URL.revokeObjectURL(url);
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
            return outboundData;
        }

        return outboundData.filter((item) => item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [outboundData, searchQuery])

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Barang Keluar
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Button
                    variant="contained" startIcon={<AddIcon />}
                    onClick={handleGetAvailableItem}
                >
                    Tambah Barang
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
                                <TableCell>Penerima</TableCell>
                                <TableCell>Alamat Penerima</TableCell>
                                <TableCell align="center">Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.created_at}</TableCell>
                                        <TableCell>{row.item_code}</TableCell>
                                        <TableCell>{row.item_name}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>{row.recipient_name}</TableCell>
                                        <TableCell width={250}>{row.recipient_address}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="download" onClick={() => handleDownload(row)}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Box sx={{ p: 4 }}>
                                            <InfoIcon color="action" sx={{ fontSize: 50, mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                Tidak ada data barang keluar.
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

            {/* Modal Tambah Barang Keluar */}
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
                            Tambah Barang Keluar
                        </Typography>
                        <Stack spacing={2}>
                            <FormControl fullWidth required>
                                <InputLabel id="item-code-label">Kode Barang</InputLabel>
                                <Select
                                    labelId="item-code-label"
                                    name="item_code"
                                    value={formData.item_code}
                                    label="Kode Barang"
                                    onChange={handleChange}
                                >
                                    {availableItems.map((item) => (
                                        <MenuItem value={item.item_code}>
                                            {item.item_code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                required
                                fullWidth
                                label="Jumlah"
                                type="number"
                                name="qty"
                                value={formData.qty}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Penerima"
                                name="recipient_name"
                                value={formData.recipient_name}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Alamat Penerima"
                                name="recipient_address"
                                value={formData.recipient_address}
                                onChange={handleChange}
                                multiline
                            />
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                            <Button variant="contained" color="primary" startIcon={<SaveIcon />} type="submit">
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
    )
}

export default OutgoingPage;