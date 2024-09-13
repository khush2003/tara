import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import owl from '../assets/owl.png';
import auth from '../assets/auth.png';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate()
  return <div>
     <div
            id="page"
            className="flex items-center justify-center h-screen rounded-sm w-screen"
        >
             
            <Card className="shadow-2xl p-7 rounded-3xl bg-white">

                    
                    <div className="grid grid-rows-3 w-[900px] h-[600px] gap-4 justify-stretch">
                        <div className="flex items-center justify-center">
                        <div className='flex-col items-center justify-center text-center'>
                            <h1 className="text-4xl font-bold">Welcome to TARA</h1>
                            <div className="p-3" />
                            <div className="flex items-center justify-center">
                            <p>Your English adventure begins here</p>
                        </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-center">
                                <img src={owl} alt='owl' width={200}
          height={200} />
                            </div>
                            <div className="flex items-center justify-center">
                            <img src={auth} alt='auth'width={200}
          height={200}  />
                            </div>
                            <div className="flex items-center justify-center">
                            <Button className='bg-cyan-700 rounded-xl w-[300px] p-6 text-lg' onClick={() => navigate('dashboard')}>
 
            Start Learning
          </Button>
                            </div>
                            <div className="flex items-center justify-center">
                            <Button className='bg-blue-950 rounded-xl w-[300px] p-6 text-lg' onClick={() => navigate('login')}>
 
 Login
</Button>
                            </div>
                        </div>
                        </div>
               
                    </Card>
  </div></div>;
};

export default OnboardingPage;
