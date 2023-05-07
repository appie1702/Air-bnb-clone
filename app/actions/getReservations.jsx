import prisma from '../../app/libs/prismadb'



export default async function getReservations(params){


    try{
        const {listingId, userId, authorId} = params;

        const query = {};

        if(listingId){
            query.listingId = listingId
        }

        if(userId){
            query.userId = userId
        }

        if(authorId){
            query.listing = {userId:authorId}
        }

        console.log(query);
        const reservations = await prisma.reservation.findMany({
            where:query,
            include: {
                listing:true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const safeReservations = reservations.map((reservation)=> ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing:{
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),
            }
        }))

        return safeReservations;
    }catch(error){
        throw new Error(error)
    }
}