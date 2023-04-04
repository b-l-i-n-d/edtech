import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Auth } from './components';
import Layout from './layouts/Layout';
import { Admin, Login, Student } from './pages';

function App() {
    const currentVideoId = useSelector((state) => state.videos.currentVideoId);

    return (
        <Routes>
            <Route element={<Auth.PersistLogin />}>
                <Route element={<Auth.RequiredLogin />}>
                    <Route element={<Layout />}>
                        <Route element={<Auth.StudentOnly />}>
                            <Route
                                path="/"
                                element={<Navigate to={`/videos/${currentVideoId}`} />}
                            />
                            <Route
                                path="/videos"
                                element={<Navigate to={`/videos/${currentVideoId}`} />}
                            />
                            <Route path="/videos/:currentVideoId">
                                <Route index element={<Student.CoursePlayer />} />
                                <Route path="quiz" element={<Student.Quizzes />} />
                            </Route>
                            <Route path="/leaderboard" element={<Student.Leaderboard />} />
                        </Route>
                        <Route element={<Auth.AdminOnly />}>
                            <Route path="/admin">
                                <Route index element={<Admin.Dashboard />} />
                                <Route path="videos" element={<Admin.Videos />} />
                                <Route path="quizzes" element={<Admin.Quizzes />} />
                                <Route path="assignments" element={<Admin.Assignments />} />
                                <Route
                                    path="assignment-marks"
                                    element={<Admin.AssignmentsMarks />}
                                />
                            </Route>
                        </Route>
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Route>
                <Route element={<Auth.NotRequiredLogin />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/register" element={<Student.Registration />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
