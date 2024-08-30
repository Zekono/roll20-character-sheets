
const updatesanitypoints = (tmp_sanity_points,sanity_points_old,sanity_points_max,update) => {
    const sanity_points = value_current(tmp_sanity_points, sanity_points_old, sanity_points_max);
    update['sanity_points_old'] = sanity_points;
    update['sanity_points'] = sanity_points;
    update['ritual_skill'] = Math.max(99-sanity_points);
    return {sanity_points:sanity_points,ritual_skill:Math.max(99-sanity_points)};
};


const updatebreakingpoints = () => {
    getAttrs(['power_score','breaking_point','sanity_points','breaking_point_reset','sanity_points_max','sanity_points_old','track_breaking_points'], (values)=> {
        const update = {};
        const flag=values.track_breaking_points==='active' ? true : false;
        const power_score = parseInt(values.power_score, 10) || 0;
        const breaking_point = parseInt(values.breaking_point, 10) || 0;
        const sanity_points_old = parseInt(values.sanity_points_old, 10) || 0;
        const sanity_points_max = parseInt(values.sanity_points_max, 10) || 0;
        const tmp_sanity_points = parseInt(values.sanity_points, 10) || 0;
        update_bp_san_ritual(tmp_sanity_points,sanity_points_old,sanity_points_max,power_score,breaking_point,update,flag);

    });
}

const update_bp_san_ritual = (tmp_sanity_points,sanity_points_old,sanity_points_max,power_score, breaking_point,update,flag) => {   
    const updated_values=updatesanitypoints(tmp_sanity_points,sanity_points_old,sanity_points_max,update);
    var update_breaking_point = breaking_point;
    if(flag && (updated_values.sanity_points<breaking_point)){
        update_breaking_point = Math.max(0,updated_values.sanity_points-power_score);
    }
    update['breaking_point_reset'] = update_breaking_point;
    update['breaking_point']=update_breaking_point;
    updateSkillSpanOnChange('ritual_skill',updated_values.ritual_skill,update,'Rituals');
}

const setResetBreakingPointsOnOpen = () => {
    getAttrs(['breaking_point','sanity_points','sanity_points_max','power_score','track_breaking_points'], (values)=> {
        const breaking_point = Math.max(0,parseInt(values.breaking_point, 10) || 0);
        const flag=values.track_breaking_points==='active' ? true : false;
        const power_score = parseInt(values.power_score, 10) || 0;

        const update = {};
        const open_sanity_points = parseInt(values.sanity_points, 10) || 0; 
        const sanity_points_max = parseInt(values.sanity_points_max, 10) || 0;
        update_bp_san_ritual(open_sanity_points,open_sanity_points,sanity_points_max,power_score,breaking_point,update,flag);
    });
};

on('change:sanity_points', () => {
    updatebreakingpoints();
});



on('change:breaking_point', () => { 
    getAttrs(['breaking_point'], (values)=> {
        const breaking_point = Math.max(0,parseInt(values.breaking_point, 10) || 0);
        const update = {};
        
        update['breaking_point_reset'] = breaking_point;
        update['breaking_point']=breaking_point;
        setAttrs(update, {silent:true}, () => {
            
            
        });
    });
});
on('change:breaking_point_reset',(eventInfo)=>{
    const breaking_point_reset = parseInt(eventInfo.newValue, 10) || 0;
    getAttrs(['breaking_point_reset'], (values)=> {
        const breaking_point_reset = parseInt(values.breaking_point_reset, 10) || 0;
        
        const update = {};
        update['breaking_point_reset'] = Math.min(Math.max(0,breaking_point_reset),99);
        setAttrs(update, {silent:true}, () => {
            
            
        });
    });
});

on('clicked:breaking_point_resets', () => {
    resetBreakingPoints();
});