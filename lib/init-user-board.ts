// import connectDB from "./db";
import connectDB from './db';
import { Board, Column} from './model'
import column from "./model/column";
import jobApplication from "./model/job-applications";


const existed_columns = [
    {
        name:"whish list",
        order:0
    },
    {
        name:"applied",
        order:1
    },
    {
        name:"rejected",
        order:2
    },
]

export async function initUserBord(userId:string) {
    try{
        await connectDB()
        // is there any board ??
        const exist= await Board.findOne({userId, name:"Job Hunt"})//go through a collection and find a record which hase a specific condition
        if (exist){
            return exist
        }
        // Creating first Board
        const board = await Board.create({
            name:"Job Hunt",
            userId,
            columns:[]
        })
        // create default col at the same time whith Promise.all()
        const creatingCols = await Promise.all(existed_columns.map((col)=>Column.create({
            name:col.name,
            order:col.order,
            boardId:board._id,
            jobApplications:[]
        })))
        board.columns = creatingCols.map((col)=>col._id)
        await board.save()
        return board
    }catch(err){
        throw err
    }
}