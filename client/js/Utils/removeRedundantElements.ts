import {createSctpClientAdapter} from "./SctpClientPromisesAdapter";
import {SctpConstrIter, SctpIteratorType} from "./sctp";
import {sc_type_arc_common, sc_type_arc_pos_const_perm, sc_type_edge_common, sc_type_node} from "./ScTypes";
import {createScKeynodes} from "./ScKeynodesSingleton";
import {getValuesOfBinding} from "./scConstrUtils";
import * as R from "ramda";

async function findSysIdBranches(sctpClient, contour: number, nrelSysId: number) {
    const sysIdArcsIterationResult = await sctpClient.iterate_constr(
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
            contour,
            sc_type_arc_pos_const_perm,
            sc_type_arc_common
        ], {
            "sysIdArc": 2
        }),
        SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
            nrelSysId,
            0,
            "sysIdArc",
        ], {}));
    const sysIdArcs = await getValuesOfBinding("sysIdArc", sysIdArcsIterationResult);
    const arcsElements = await Promise.all(sysIdArcs.map((arc) => sctpClient.get_arc(arc)));
    const targets = R.map(R.prop("1"), arcsElements);
    // [arcAddr, targetAddr]
    const branches = R.zip(sysIdArcs, targets);
    return Promise.resolve(branches);
}

async function getSetElements(sctpClient, contour: number) {
    const answerTuples = await sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
        [contour, sc_type_arc_pos_const_perm, 0]);
    return Promise.resolve(R.map(R.prop("2"), answerTuples));
}

function setContract(leftSet, rightSet) {
    return R.reduce((set, val) => {
        set.delete(val);
        return set
    }, leftSet, rightSet);
}

async function addToSet(sctpClient, setAddr, elementAddr) {
    sctpClient.create_arc(sc_type_arc_pos_const_perm, setAddr, elementAddr);
}

async function saveSet(sctpClient, set) {
    const setNode = await sctpClient.create_node(sc_type_node);
    await Promise.all(R.map((setElement) => addToSet(sctpClient, setNode, setElement), set));
    return setNode;
}

/**
 *
 * @param question
 * @returns {Promise<number>}
 */
export async function removeRedundantElements(question: number): Promise<number> {
    const sctpClient = createSctpClientAdapter();
    // await получает промис из асинзронной функции, цункция прожолжит выполнение после завершения промиса
    const scKeynodes = await createScKeynodes();
    const nrel_answer = await scKeynodes.resolveKeynode('nrel_answer');
    const nrel_system_identifier = await scKeynodes.resolveKeynode('nrel_system_identifier');

    // получить контур ответа
    const answerTuples = await sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
        [question, sc_type_arc_common, sc_type_node, sc_type_arc_pos_const_perm, nrel_answer]);
    const answer = answerTuples[0][2];

    // получить все ветки  системных идентификаторов
    const branches = await findSysIdBranches(sctpClient, answer, nrel_system_identifier);
    const branchesSet = new Set(R.flatten(branches));
    // получить все множество
    const contourSet = new Set(await getSetElements(sctpClient, answer));
    // вычислить разницу множество/системные идентификаторы
    const contract = setContract(contourSet, branchesSet);
    // сохранить результат
    const newAnswer = await saveSet(sctpClient, contract);
    // добавить ответ на вопрос
    const newQuestion = await sctpClient.create_node(sc_type_node);
    const newAnswerArc = await sctpClient.create_arc(sc_type_edge_common, newQuestion, newAnswer);
    await sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_system_identifier, newAnswerArc);
    // удалить предыдущий ответ (хер с ним) :) позже поправишь
    // удалить ответ из вопроса
    // await sctpClient.erase_element(answerTuples[0][3]);
    return Promise.resolve(newQuestion);
}