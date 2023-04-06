const scrollVideoIntoView = (selected) => {
    const element = document.getElementById(`video-${selected}`);
    console.log(selected);
    if (element) {
        console.log(element);
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export default scrollVideoIntoView;
