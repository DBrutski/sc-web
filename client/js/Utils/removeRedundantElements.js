var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createSctpClientAdapter } from "./SctpClientPromisesAdapter";
import { SctpIteratorType } from "./sctp";
import { sc_type_arc_common, sc_type_arc_pos_const_perm, sc_type_node } from "./ScTypes";
/**
 *
 * @param question
 * @returns {Promise<number>}
 */
export function removeRedundantElements(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const sctpClient = createSctpClientAdapter();
        // получить контур ответа
        sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [question, sc_type_arc_common, sc_type_node, sc_type_arc_pos_const_perm]);
        // получить все ветки  системных идентификаторов
        // получить все множество
        // вычислить разницу множество/системные идентификаторы
        // сохранить результат
        // добавить ответ на вопрос
        // удалить предыдущий ответ (хер с ним) :) позже поправишь
        // удалить ответ из вопроса
    });
}
