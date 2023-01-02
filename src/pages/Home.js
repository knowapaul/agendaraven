// MUI Resources
import { CssBaseline, Box, Typography } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

// Project Resources
import Nav from '../components/Nav.js'
import { mTheme } from '../resources/Themes.js';


{/* <Box padding={7} bgcolor={oTheme.palette.primary.main}>
    <video width="100%" autoPlay muted loop>
        <source src="homepage.mp4" type="video/mp4"/>
        Your browser does not support the video tag.
    </video>
</Box> */}

{/* <SideVideo videoURL='https://www.youtube.com/embed/Ww_tuVeGmYU'>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam vestibulum morbi blandit cursus risus at ultrices. Eu scelerisque felis imperdiet proin fermentum leo vel orci. Amet cursus sit amet dictum sit amet justo. Est ullamcorper eget nulla facilisi etiam dignissim diam. Nisi porta lorem mollis aliquam ut porttitor. Faucibus vitae aliquet nec ullamcorper sit amet. Elit ut aliquam purus sit amet. Eget sit amet tellus cras adipiscing enim eu turpis. Mattis pellentesque id nibh tortor. Integer feugiat scelerisque varius morbi enim nunc. Aliquam ultrices sagittis orci a scelerisque purus semper.

Odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. In aliquam sem fringilla ut morbi tincidunt augue. Tristique risus nec feugiat in fermentum. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. At consectetur lorem donec massa sapien faucibus et molestie. Aliquam purus sit amet luctus venenatis lectus. Nisl condimentum id venenatis a. Egestas tellus rutrum tellus pellentesque. Dui faucibus in ornare quam viverra orci. Aliquet nec ullamcorper sit amet. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Placerat orci nulla pellentesque dignissim enim sit. Tristique sollicitudin nibh sit amet commodo. Netus et malesuada fames ac turpis egestas integer eget aliquet. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. Nibh ipsum consequat nisl vel pretium. Consequat semper viverra nam libero justo laoreet sit amet cursus. Orci phasellus egestas tellus rutrum tellus pellentesque. Eu augue ut lectus arcu.

Vulputate eu scelerisque felis imperdiet proin fermentum. Praesent tristique magna sit amet purus. Urna nunc id cursus metus aliquam. Risus quis varius quam quisque id diam vel quam. Tortor posuere ac ut consequat. Id diam maecenas ultricies mi eget mauris pharetra et. Eu tincidunt tortor aliquam nulla facilisi. Auctor neque vitae tempus quam pellentesque nec nam aliquam sem. Tortor posuere ac ut consequat semper viverra nam. Urna cursus eget nunc scelerisque viverra mauris. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Purus non enim praesent elementum facilisis leo. Vestibulum sed arcu non odio euismod lacinia at. Phasellus egestas tellus rutrum tellus pellentesque. Ut ornare lectus sit amet est placerat in egestas. Dui ut ornare lectus sit amet est placerat in egestas. Felis eget velit aliquet sagittis. Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Ipsum dolor sit amet consectetur.

Facilisis sed odio morbi quis commodo odio aenean. Aliquam id diam maecenas ultricies mi eget mauris pharetra et. A pellentesque sit amet porttitor eget dolor morbi non. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Vitae elementum curabitur vitae nunc sed velit. Amet cursus sit amet dictum sit amet. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Tincidunt eget nullam non nisi est. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Interdum consectetur libero id faucibus nisl tincidunt eget. Duis tristique sollicitudin nibh sit. In nibh mauris cursus mattis molestie a iaculis. Aliquet risus feugiat in ante metus dictum at tempor commodo. Sit amet nisl purus in mollis nunc sed. Vestibulum morbi blandit cursus risus. Dui faucibus in ornare quam viverra orci sagittis. Turpis tincidunt id aliquet risus feugiat in ante metus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Congue eu consequat ac felis donec et odio. Et pharetra pharetra massa massa ultricies mi quis hendrerit dolor.

Dignissim enim sit amet venenatis urna cursus eget nunc. Urna duis convallis convallis tellus. Condimentum id venenatis a condimentum. Egestas sed sed risus pretium quam. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Cursus turpis massa tincidunt dui ut ornare. Pharetra vel turpis nunc eget lorem dolor sed. Sed libero enim sed faucibus turpis. Sit amet est placerat in egestas erat imperdiet sed. Et ultrices neque ornare aenean. Enim tortor at auctor urna nunc id. Ac auctor augue mauris augue neque. In tellus integer feugiat scelerisque. Varius vel pharetra vel turpis nunc.
</SideVideo>
<SideVideo videoURL='https://www.youtube.com/embed/Ww_tuVeGmYU'>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam vestibulum morbi blandit cursus risus at ultrices. Eu scelerisque felis imperdiet proin fermentum leo vel orci. Amet cursus sit amet dictum sit amet justo. Est ullamcorper eget nulla facilisi etiam dignissim diam. Nisi porta lorem mollis aliquam ut porttitor. Faucibus vitae aliquet nec ullamcorper sit amet. Elit ut aliquam purus sit amet. Eget sit amet tellus cras adipiscing enim eu turpis. Mattis pellentesque id nibh tortor. Integer feugiat scelerisque varius morbi enim nunc. Aliquam ultrices sagittis orci a scelerisque purus semper.

Odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. In aliquam sem fringilla ut morbi tincidunt augue. Tristique risus nec feugiat in fermentum. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. At consectetur lorem donec massa sapien faucibus et molestie. Aliquam purus sit amet luctus venenatis lectus. Nisl condimentum id venenatis a. Egestas tellus rutrum tellus pellentesque. Dui faucibus in ornare quam viverra orci. Aliquet nec ullamcorper sit amet. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Placerat orci nulla pellentesque dignissim enim sit. Tristique sollicitudin nibh sit amet commodo. Netus et malesuada fames ac turpis egestas integer eget aliquet. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. Nibh ipsum consequat nisl vel pretium. Consequat semper viverra nam libero justo laoreet sit amet cursus. Orci phasellus egestas tellus rutrum tellus pellentesque. Eu augue ut lectus arcu.

Vulputate eu scelerisque felis imperdiet proin fermentum. Praesent tristique magna sit amet purus. Urna nunc id cursus metus aliquam. Risus quis varius quam quisque id diam vel quam. Tortor posuere ac ut consequat. Id diam maecenas ultricies mi eget mauris pharetra et. Eu tincidunt tortor aliquam nulla facilisi. Auctor neque vitae tempus quam pellentesque nec nam aliquam sem. Tortor posuere ac ut consequat semper viverra nam. Urna cursus eget nunc scelerisque viverra mauris. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Purus non enim praesent elementum facilisis leo. Vestibulum sed arcu non odio euismod lacinia at. Phasellus egestas tellus rutrum tellus pellentesque. Ut ornare lectus sit amet est placerat in egestas. Dui ut ornare lectus sit amet est placerat in egestas. Felis eget velit aliquet sagittis. Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum. Ipsum dolor sit amet consectetur.

Facilisis sed odio morbi quis commodo odio aenean. Aliquam id diam maecenas ultricies mi eget mauris pharetra et. A pellentesque sit amet porttitor eget dolor morbi non. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Vitae elementum curabitur vitae nunc sed velit. Amet cursus sit amet dictum sit amet. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Tincidunt eget nullam non nisi est. Tempor orci dapibus ultrices in iaculis nunc sed augue lacus. Interdum consectetur libero id faucibus nisl tincidunt eget. Duis tristique sollicitudin nibh sit. In nibh mauris cursus mattis molestie a iaculis. Aliquet risus feugiat in ante metus dictum at tempor commodo. Sit amet nisl purus in mollis nunc sed. Vestibulum morbi blandit cursus risus. Dui faucibus in ornare quam viverra orci sagittis. Turpis tincidunt id aliquet risus feugiat in ante metus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Congue eu consequat ac felis donec et odio. Et pharetra pharetra massa massa ultricies mi quis hendrerit dolor.

Dignissim enim sit amet venenatis urna cursus eget nunc. Urna duis convallis convallis tellus. Condimentum id venenatis a condimentum. Egestas sed sed risus pretium quam. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Cursus turpis massa tincidunt dui ut ornare. Pharetra vel turpis nunc eget lorem dolor sed. Sed libero enim sed faucibus turpis. Sit amet est placerat in egestas erat imperdiet sed. Et ultrices neque ornare aenean. Enim tortor at auctor urna nunc id. Ac auctor augue mauris augue neque. In tellus integer feugiat scelerisque. Varius vel pharetra vel turpis nunc.
</SideVideo>
<Footer /> */}

export default function Home() {
    return (
        <div>
            <ThemeProvider theme={mTheme}>
                <CssBaseline />
                <Nav />
                
                <Box padding={2}>
                    <Typography
                    variant={'h6'}
                    >
                        Welcome to AgendaRaven!
                    </Typography>
                    <Typography
                    variant='h6'
                    >
                        Click "dashboard" and create an account to get started.
                    </Typography>
                </Box>
            </ThemeProvider>
        </div>
    )
}