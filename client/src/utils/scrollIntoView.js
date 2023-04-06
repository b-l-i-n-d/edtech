const scrollVideoIntoView = (selected) => {
    const element = document.getElementById(`video-${selected}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export default scrollVideoIntoView;
