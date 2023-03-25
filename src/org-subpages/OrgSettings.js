// MUI Resources
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AdminCheck from "../components/AdminCheck";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { FileUpload } from "../components/FileUpload";
import { uTheme } from "../resources/Themes";

function CustomAccordion(props) {

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMore sx={{color: uTheme.palette.background.default}}/>}
            >
                <Typography
                variant="h6"
                >
                    {props.title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{padding: 0}}>
                <Paper 
                square
                elevation={0}
                variant='outlined'
                sx={{ padding: 2}}
                >

                {props.children}
                </Paper>
            </AccordionDetails>
        </Accordion>
    )
}

export default function OrgSettings(props) {
    return (
        <ErrorBoundary>
            <AdminCheck 
            helperText={
                <Paper sx={{margin: 2, padding: 2}}>
                    <Typography padding={6} width={'100%'} textAlign={'center'}>
                        Sorry, your role in this organization does not allow you to view this page.
                    </Typography>
                </Paper>
            }
            org={props.org}
            >
                <Box
                padding={2}
                >
                    <CustomAccordion title={"Permissions"}>
                        Contents
                    </CustomAccordion>
                    <CustomAccordion title={"Roles"}>
                        Contents
                    </CustomAccordion>
                    <CustomAccordion title={"Customization"}>
                        <Typography variant="h6">
                            Logo Icon
                        </Typography>
                        <Typography variant="body">
                            Upload a logo icon here. Refresh page for changes to take effect.
                        </Typography>
                        <FileUpload 
                        path={props.org + '/index/icon'}
                        button={"fill"}
                        accept={'.jpg,.png,.pdf'}
                        />
                    </CustomAccordion>
                    <CustomAccordion title={"Payments"}>
                        AgendaRaven is currently free, but in order to keep 
                        operating costs down, it is necessary to restrict the
                        use of certain services. These are shown below.
                    </CustomAccordion>
                </Box>
            </AdminCheck>
        </ErrorBoundary>
    )
}