import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data = 
| { message: string }
| IUser[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUsers(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
};

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json(users)
}

const updateUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { userId = '', role = '' } = req.body;

    if( !isValidObjectId(userId) ){
        return res.status(400).json({ message: 'Ningun usuario coincide con ese ID' })
    }

    const validRoles = ['client', 'admin', 'super-user', 'SEO']

    if( !validRoles.includes(role) ){
        return res.status(400).json({ message: 'Rol invalido'  })
    }

    await db.connect();
    const user = await User.findById( userId );

    if ( !user ){
        await db.disconnect();
        return res.status(400).json({ message: 'No hay usuarios que coincidan con el id: ' + userId });
    }

    user.role = role;
    await user.save();
    await db.disconnect();

    return res.status(200).json({ message: 'Usuario Actualizado' });
}

